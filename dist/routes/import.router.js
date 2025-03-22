"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const import_controller_1 = require("../controllers/import.controller");
const router = express_1.default.Router();
// Cấu hình Multer
const upload = (0, multer_1.default)();
//[POST] import/json
router.post("/json", upload.single("file"), import_controller_1.importJson);
//[POST] import/excel
router.post("/excel", upload.single("file"), import_controller_1.importExcel);
exports.default = router;
//# sourceMappingURL=import.router.js.map