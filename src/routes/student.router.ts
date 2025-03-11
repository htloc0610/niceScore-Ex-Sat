//this file is API router for student
import { Router } from "express";
import studentController from "../controllers/student.controller";

const studentRouter = Router();

studentRouter.get("/student", studentController.getStudentHome);

studentRouter.get("/faculty", studentController.getListFaculties);

studentRouter.post("/add_student", studentController.addStudent);

studentRouter.put("/update_student", studentController.updateStudent);

studentRouter.post('/delete_student', studentController.deleteStudent);

export default studentRouter;
