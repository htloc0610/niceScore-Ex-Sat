"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const import_controller_1 = require("../controllers/import.controller");
const importRouter = express_1.default.Router();
// Cấu hình Multer
const upload = (0, multer_1.default)();
//[POST] import/json
importRouter.post("/json", upload.single("file"), import_controller_1.importJson);
//[POST] import/excel
importRouter.post("/excel", upload.single("file"), import_controller_1.importExcel);
exports.default = importRouter;
//# sourceMappingURL=import.router.js.map