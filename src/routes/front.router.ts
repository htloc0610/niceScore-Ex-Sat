//this file is API router for student
import { Router } from "express";
import path from "path";

const router = Router();

// [GET] /more
router.get("/more", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/more.html"));
});

// [GET] /add
router.get("/add", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/add.html"));
});

// [GET] /
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// [GET] /:id
router.get("/:id", (req, res) => {
  res.sendFile(path.join(__dirname, "../../public/detail.html"));
});

export default router;
