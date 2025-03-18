import express from "express";
import { exportToJson, exportToExcel } from "../controllers/export.controller";

const router = express.Router();

router.get("/json", exportToJson);
router.get("/excel", exportToExcel);

export default router;
