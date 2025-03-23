//this file is API router for student
import { Router } from "express";
import studentController from "../controllers/student.controller";

const studentRouter = Router();

// [GET] /api/student
studentRouter.get("/", studentController.getStudentHome);

// [GET] /api/student/:id
studentRouter.get("/:id", studentController.getStudentById);

// [PUT] /api/student:/id
studentRouter.put("/:id", studentController.updateStudentById);

// [POST] /api/student
studentRouter.post("/", studentController.addStudent);

// [PUT] /api/student
studentRouter.put("/", studentController.updateStudent);

// [DELETE] /api/student
studentRouter.delete("/", studentController.deleteStudent);

export default studentRouter;
