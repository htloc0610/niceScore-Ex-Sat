import { Router } from "express";
import moduleController from "../controllers/module.controller";

const moduleRouter = Router();

// [GET] /api/module
moduleRouter.get("/", moduleController.getListModules);

// [POST] /api/module
moduleRouter.post("/", moduleController.addModule);

// [GET] /api/module/:id
moduleRouter.get("/:id", moduleController.getModule);

// [PUT] /api/module/:id
moduleRouter.put("/:id", moduleController.updateModule);

export default moduleRouter;
