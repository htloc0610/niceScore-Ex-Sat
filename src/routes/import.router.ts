import express from "express";
import multer from "multer";
import { importJson, importExcel } from "../controllers/import.controller";

const router = express.Router();

// Cấu hình Multer
const upload = multer();

router.post("/json", upload.single("file"), importJson);
router.post("/excel", upload.single("file"), importExcel);

export default router;
