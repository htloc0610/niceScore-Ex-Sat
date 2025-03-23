import { Router } from "express";
import facultyController from "../controllers/faculty.controller";

const facultyRouter = Router();

// [GET] /api/faculty
facultyRouter.get("/faculty", facultyController.getListFaculties);

// [POST] /api/add_faculty
facultyRouter.post("/add_faculty", facultyController.addFaculty);

// [PUT] /api/update_faculty
facultyRouter.put("/update_faculty", facultyController.updateFaculty);

export default facultyRouter;
