import express from "express";
import exportController from "../controllers/export.controller";

const exportRouter = express.Router();

//[GET] export/json
exportRouter.get("/json", exportController.exportToJson);

//[GET] export/json
exportRouter.get("/excel", exportController.exportToExcel);

//[GET] export/grade/:id
exportRouter.get("/grade/:id", exportController.exportGrade);

export default exportRouter;
