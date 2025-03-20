//this file is API router for student
import { Router } from "express";
import studentController from "../controllers/student.controller";

const studentRouter = Router();

studentRouter.get("/student", studentController.getStudentHome);

studentRouter.get("/faculty", studentController.getListFaculties);

studentRouter.get("/status", studentController.getListStatus);

studentRouter.get("/course", studentController.getListCourse);

studentRouter.get("/student/:id", studentController.getStudentById);

studentRouter.put("/student/:id", studentController.updateStudentById);

studentRouter.post("/add_student", studentController.addStudent);

studentRouter.put("/update_student", studentController.updateStudent);

studentRouter.post('/delete_student', studentController.deleteStudent);

studentRouter.post("/add_faculty", studentController.addFaculty);

studentRouter.put("/update_faculty", studentController.updateFaculty);

studentRouter.post("/add_status", studentController.addStatus);

studentRouter.put("/update_status", studentController.updateStatus);

studentRouter.post("/add_course", studentController.addCourse);

studentRouter.put("/update_course", studentController.updateCourse);

export default studentRouter;
