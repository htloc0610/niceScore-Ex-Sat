import { Router } from "express";
import configurationService from "../services/configurations.service";
import facultyService from "../services/faculty.service";
import statusService from "../services/status.service";
import courseService from "../services/course.service";
import studentService from "../services/student.service";
import moduleService from "../services/module.service";
import classService from "../services/class.service";
import class_registationService from "../services/class_registation.service";

const router = Router();

// [GET] /more
router.get("/more", async (req, res) => {
  const faculties = await facultyService.getAllFaculties(); 
  const statuses = await statusService.getAllStatuses();
  const courses = await courseService.getAllCourses();
  const lang = res.locals.lang || 'en';
  const modules = await moduleService.getAllModules(lang);
  res.render("more", {
    faculties: faculties, 
    statuses: statuses, 
    courses: courses, 
    modules: modules,
    lang: lang
  }); // Render the "more" Handlebars template with language
});

// [GET] /add
router.get("/add", (req, res) => {
  const lang = res.locals.lang || 'en';
  res.render("add", { lang: lang }); // Render the "add" Handlebars template with language
});

// [GET] /configuration
router.get("/configurations", async (req, res) => {
  const configurations = await configurationService.getAllConfiguration(); // Get the configurations from the service
  const lang = res.locals.lang || 'en';
  res.render("configurations", {
    configurations: configurations,
    lang: lang
  }); // Render the "configurations" Handlebars template with language
});

// [GET] /module
router.get("/module", async (req, res) => {
  const lang = res.locals.lang || 'en';
  const modules = await moduleService.getAllModules(lang); // Get the modules from the service with language
  res.render("module", {modules: modules, lang: lang}); // Render the "class" Handlebars template with language
});

// [GET] /class
router.get("/class/:id", async (req, res) => {
  const idInt = parseInt( req.params.id, 10); // Convert the ID to an integer
  if (isNaN(idInt)) {
    return res.status(400).render("error", { message: "Invalid class ID" });
  }

  // Get class details
  const classData = await classService.getClassById(idInt);
  if (!classData) {
    return res.status(404).render("error", { message: "Class not found" });
  }

  // Get students in class
  const students = await class_registationService.getRegistrationsByClassId(idInt);
  const lang = res.locals.lang || 'en';

  // console.log(students);

  res.render("class", {
    classes: classData, // Ensure this matches the template variable
    students: students || [], // Ensure students is always an array
    lang: lang // Add language
  });
});

// [GET] /:id
router.get("/:id", async (req, res) => {
  try {
    const lang = res.locals.lang || 'en';
    const studentId = req.params.id;

    console.log("Fetching details for student ID:", studentId);
    
    // Fetch student data from the database
    const student = await studentService.getStudentById(parseInt(studentId, 10));
    
    if (!student) {
      return res.status(404).render("error", { 
        message: lang === 'en' ? "Student not found" : "Không tìm thấy sinh viên",
        lang: lang 
      });
    }
    
    // Convert Sequelize model to plain object
    const studentData = student.get({ plain: true });
    
    // Render the "detail" Handlebars template with the student data and language
    res.render("detail", { 
      id: studentId, 
      student: studentData, 
      lang: lang 
    });
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).render("error", {
      message: res.locals.lang === 'en' ? "An error occurred while fetching student details." : "Đã xảy ra lỗi khi lấy thông tin sinh viên.",
      lang: res.locals.lang || 'en'
    });
  }
});

// [GET] /
router.get("/", async (req, res) => {
  const faculties = await facultyService.getAllFaculties();
  const studentsDataValue = await studentService.getListStudent();
  const students = studentsDataValue.map(student => student.get({plain: true}));
  // console.log(students);
  const lang = res.locals.lang || 'en';
  res.render("index", {faculties: faculties, students: students, lang: lang}); // Render the "index" Handlebars template
});

export default router;
