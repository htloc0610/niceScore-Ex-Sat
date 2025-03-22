import express from "express";
import multer from "multer";
import { importJson, importExcel } from "../controllers/import.controller";

const router = express.Router();

// Cấu hình Multer
const upload = multer();

//[POST] import/json
router.post("/json", upload.single("file"), importJson);

//[POST] import/excel
router.post("/excel", upload.single("file"), importExcel);

export default router;
