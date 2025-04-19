"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configurations_controller_1 = __importDefault(require("../controllers/configurations.controller"));
const configurationsRouter = (0, express_1.Router)();
// [GET] /api/configurations
configurationsRouter.get("/", configurations_controller_1.default.getListConfigurations);
// // [POST] /api/configurations
configurationsRouter.post("/", configurations_controller_1.default.addConfiguration);
// [PUT] /api/configurations
configurationsRouter.put("/", configurations_controller_1.default.updateConfiguration);
exports.default = configurationsRouter;
//# sourceMappingURL=configurations.router.js.map