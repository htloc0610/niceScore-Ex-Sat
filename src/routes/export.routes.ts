import express from "express";
import { exportToJson, exportToExcel } from "../controllers/export.controller";

const router = express.Router();

//[GET] export/json
router.get("/json", exportToJson);

//[GET] export/json
router.get("/excel", exportToExcel);

export default router;
