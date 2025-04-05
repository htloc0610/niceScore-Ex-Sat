import { Router } from "express";
import configurationService from "../services/configurations.service";
import facultyService from "../services/faculty.service";
import statusService from "../services/status.service";
import courseService from "../services/course.service";
import studentService from "../services/student.service";
import moduleService from "../services/module.service";
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
  console.log(students);
  res.render("index", {faculties: faculties, students: students}); // Render the "index" Handlebars template
});


export default router;
