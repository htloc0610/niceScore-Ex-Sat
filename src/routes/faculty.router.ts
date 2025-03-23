//this file is API router for student
import { Router } from "express";
import facultyController from "../controllers/faculty.controller";

const facultyRouter = Router();

// [GET] /api/student/faculty
facultyRouter.get("/faculty", facultyController.getListFaculties);

// [POST] /api/student/add_faculty
facultyRouter.post("/add_faculty", facultyController.addFaculty);

// [PUT] /api/student/update_faculty
facultyRouter.put("/update_faculty", facultyController.updateFaculty);

export default facultyRouter;
