import { Router } from "express";
import classRegistationController from "../controllers/class_registation.controller";

const classRegistationRouter = Router();

// [GET] /api/class_registation/${classId}
classRegistationRouter.get("/:classId", classRegistationController.getClassRegistationByClassId);

// [GET] /api/class_registation
classRegistationRouter.get("/", classRegistationController.getClassRegistationList);

// [POST] /api/class_registation
classRegistationRouter.post("/", classRegistationController.addClassRegistation);

// [GET] /api/class_registation/:id
classRegistationRouter.get("/:id", classRegistationController.getClassRegistation);

// // [PUT] /api/class_registation/:id
// classRegistationRouter.put("/:id", classRegistationController.updateClassRegistation);

// [DELETE] /api/class_registation/:id
classRegistationRouter.delete("/:id", classRegistationController.deleteClassRegistation);

export default classRegistationRouter;
