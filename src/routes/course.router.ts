import { Router } from "express";
import courseController from "../controllers/course.controller";

const courseRouter = Router();

// [GET] /api/course
courseRouter.get("/course", courseController.getListCourse);

// [POST] /api/add_course
courseRouter.post("/add_course", courseController.addCourse);

// [PUT] /api/update_course
courseRouter.put("/update_course", courseController.updateCourse);

export default courseRouter;
