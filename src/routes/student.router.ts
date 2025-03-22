//this file is API router for student
import { Router } from "express";
import studentController from "../controllers/student.controller";

const studentRouter = Router();

// [GET] /api/student
studentRouter.get("/student", studentController.getStudentHome);

// [GET] /api/student/faculty
studentRouter.get("/faculty", studentController.getListFaculties);

// [GET] /api/student/status
studentRouter.get("/status", studentController.getListStatus);

// [GET] /api/student/course
studentRouter.get("/course", studentController.getListCourse);

// [GET] /api/student/:id
studentRouter.get("/student/:id", studentController.getStudentById);

// [PUT] /api/student/:id
studentRouter.put("/student/:id", studentController.updateStudentById);

// [POST] /api/student/add_student
studentRouter.post("/add_student", studentController.addStudent);

// [PUT] /api/student/update_student
studentRouter.put("/update_student", studentController.updateStudent);

// [POST] /api/student/delete_student
studentRouter.post("/delete_student", studentController.deleteStudent);

// [POST] /api/student/add_faculty
studentRouter.post("/add_faculty", studentController.addFaculty);

// [PUT] /api/student/update_faculty
studentRouter.put("/update_faculty", studentController.updateFaculty);

// [POST] /api/student/add_status
studentRouter.post("/add_status", studentController.addStatus);

// [PUT] /api/student/update_status
studentRouter.put("/update_status", studentController.updateStatus);

// [POST] /api/student/add_course
studentRouter.post("/add_course", studentController.addCourse);

// [PUT] /api/student/update_course
studentRouter.put("/update_course", studentController.updateCourse);

export default studentRouter;
