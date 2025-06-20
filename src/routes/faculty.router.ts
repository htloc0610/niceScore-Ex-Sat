import { Router } from "express";
import facultyController from "../controllers/faculty.controller";

const facultyRouter = Router();

// [GET] /api/faculty
facultyRouter.get("/", facultyController.getListFaculties);

facultyRouter.get("/:id", facultyController.getFacultyById);

// [POST] /api/faculty
facultyRouter.post("/", facultyController.addFaculty);

// [PUT] /api/faculty"
facultyRouter.put("/", facultyController.updateFaculty);

export default facultyRouter;
