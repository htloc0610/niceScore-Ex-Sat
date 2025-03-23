"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const export_controller_1 = require("../controllers/export.controller");
const exportRouter = express_1.default.Router();
//[GET] export/json
exportRouter.get("/json", export_controller_1.exportToJson);
//[GET] export/json
exportRouter.get("/excel", export_controller_1.exportToExcel);
exports.default = exportRouter;
//# sourceMappingURL=export.routes.js.map