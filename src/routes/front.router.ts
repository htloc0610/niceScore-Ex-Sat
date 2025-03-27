import { Router } from "express";
import configurationService from "../services/configurations.service";
import facultyService from "../services/faculty.service";
import statusService from "../services/status.service";
import courseService from "../services/course.service";
const router = Router();

// [GET] /more
router.get("/more", async (req, res) => {
  const faculties = await facultyService.getAllFaculties(); 
  const statuses = await statusService.getAllStatuses();
  const courses = await courseService.getAllCourses();
  console.log("Faculties list: ", courses, statuses);
  res.render("more", {faculties: faculties, statuses: statuses, courses: courses}); // Render the "more" Handlebars template
});

// [GET] /add
router.get("/add", (req, res) => {
  res.render("add"); // Render the "add" Handlebars template
});

// [GET] /
router.get("/configurations", async (req, res) => {
  const configurations = await configurationService.getAllConfiguration(); // Get the configurations from the service
  res.render("configurations", {configurations: configurations}); // Render the "configurations" Handlebars template
});


// [GET] /
router.get("/", (req, res) => {
  res.render("index"); // Render the "index" Handlebars template
});

// [GET] /:id
router.get("/:id", (req, res) => {
  res.render("detail", { id: req.params.id }); // Render the "detail" Handlebars template with the id parameter
});

export default router;
