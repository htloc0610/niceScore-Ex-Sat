import { Router } from "express";
import classController from "../controllers/class.controller";

const classRouter = Router();

// [GET] /api/class/module/:id
classRouter.get("/module/:id", classController.getClassByModuleId);

// [GET] /api/class
classRouter.get("/", classController.getListClasses);

// [POST] /api/class
classRouter.post("/", classController.addClass);

// [GET] /api/class/:id
classRouter.get("/:id", classController.getClass);

// [PUT] /api/class/:id
classRouter.put("/:id", classController.updateClass);

// [DELETE] /api/class/:id
classRouter.delete("/:id", classController.deleteClass);

export default classRouter;
