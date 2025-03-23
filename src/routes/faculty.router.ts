import { Router } from "express";
import facultyController from "../controllers/faculty.controller";

const facultyRouter = Router();

facultyRouter.get("/faculty", facultyController.getListFaculties);

facultyRouter.post("/add_faculty", facultyController.addFaculty);

facultyRouter.put("/update_faculty", facultyController.updateFaculty);

export default facultyRouter;
