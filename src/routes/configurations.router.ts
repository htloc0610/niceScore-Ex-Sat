import { Router } from "express";
import configurationsController from "../controllers/configurations.controller";

const configurations = Router();

// [GET] /api/configurations
configurations.get("/", configurationsController.getListConfigurations);

// // [POST] /api/configurations
configurations.post("/", configurationsController.addConfiguration);

// [PUT] /api/configurations
configurations.put("/", configurationsController.updateConfiguration);

export default configurations;
