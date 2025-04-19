import { Router } from "express";
import configurationsController from "../controllers/configurations.controller";

const configurationsRouter = Router();

// [GET] /api/configurations
configurationsRouter.get("/", configurationsController.getListConfigurations);

// // [POST] /api/configurations
configurationsRouter.post("/", configurationsController.addConfiguration);

// [PUT] /api/configurations
configurationsRouter.put("/", configurationsController.updateConfiguration);

export default configurationsRouter;
