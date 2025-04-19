import express from "express";
import multer from "multer";
import { importJson, importExcel } from "../controllers/import.controller";

const importRouter = express.Router();

// Cấu hình Multer
const upload = multer();

//[POST] import/json
importRouter.post("/json", upload.single("file"), importJson);

//[POST] import/excel
importRouter.post("/excel", upload.single("file"), importExcel);

export default importRouter;
