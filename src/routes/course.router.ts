import { Router } from "express";
import courseController from "../controllers/course.controller";

const courseRouter = Router();

// [GET] /api/course
courseRouter.get("/", courseController.getListCourse);

// [POST] /api/course
courseRouter.post("/", courseController.addCourse);

// [PUT] /api/course
courseRouter.put("/", courseController.updateCourse);

export default courseRouter;
