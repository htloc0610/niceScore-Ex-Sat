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
  const modules = await moduleService.getAllModules();
  res.render("more", {faculties: faculties, statuses: statuses, courses: courses, modules: modules}); // Render the "more" Handlebars template
});

// [GET] /add
router.get("/add", (req, res) => {
  res.render("add"); // Render the "add" Handlebars template
});

// [GET] /configuration
router.get("/configurations", async (req, res) => {
  const configurations = await configurationService.getAllConfiguration(); // Get the configurations from the service
  res.render("configurations", {configurations: configurations}); // Render the "configurations" Handlebars template
});

// [GET] /module
router.get("/module", async (req, res) => {
  const modules = await moduleService.getAllModules(); // Get the modules from the service
  res.render("module", {modules: modules}); // Render the "class" Handlebars template
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

  // console.log(students);

  res.render("class", {
    classes: classData, // Ensure this matches the template variable
    students: students || [], // Ensure students is always an array
  });
});

// [GET] /:id
router.get("/:id", (req, res) => {
  res.render("detail", { id: req.params.id }); // Render the "detail" Handlebars template with the id parameter
});

// [GET] /
router.get("/", async (req, res) => {
  const faculties = await facultyService.getAllFaculties();
  faculties.unshift({ faculty_id: "", name: "Tất cả khoa" });
  const studentsDataValue = await studentService.getListStudent();
  const students = studentsDataValue.map(student => student.get({plain: true}));
  // console.log(students);
  const lang = ['en', 'vi'].includes(req.query.lang as string) ? req.query.lang : 'en';
  res.render("index", {faculties: faculties, students: students, lang: lang}); // Render the "index" Handlebars template
});

export default router;
