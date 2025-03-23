import express from "express";
import { exportToJson, exportToExcel } from "../controllers/export.controller";

const exportRouter = express.Router();

//[GET] export/json
exportRouter.get("/json", exportToJson);

//[GET] export/json
exportRouter.get("/excel", exportToExcel);

export default exportRouter;
