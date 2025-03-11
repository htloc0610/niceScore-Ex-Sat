//this file is API router for student
import { Router } from "express";
import studentController from "../controllers/student.controller";

const studentRouter = Router();

studentRouter.get("/student", studentController.getStudentHome);

studentRouter.get("/faculty", studentController.getListFaculties);

studentRouter.post("/add_student", studentController.addStudent);

export default studentRouter;
