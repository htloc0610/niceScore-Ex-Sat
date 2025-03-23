import { Router } from "express";
import courseController from "../controllers/course.controller";

const courseRouter = Router();

courseRouter.get("/course", courseController.getListCourse);

courseRouter.post("/add_course", courseController.addCourse);

courseRouter.put("/update_course", courseController.updateCourse);

export default courseRouter;
