//this file is API router for student
import { Router } from "express";
import path from "path";

const router = Router();

// // [GET] /more
// router.get("/more", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../public/more.html"));
// });

// // [GET] /add
// router.get("/add", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../public/add.html"));
// });

// // [GET] /
// router.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../public/index.html"));
// });

// // [GET] /:id
// router.get("/:id", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../public/detail.html"));
// });


// [GET] /more
router.get("/more", (req, res) => {
  res.render("more"); // Render the "more" Handlebars template
});

// [GET] /add
router.get("/add", (req, res) => {
  res.render("add"); // Render the "add" Handlebars template
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
