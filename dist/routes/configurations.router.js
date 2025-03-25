"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configurations_controller_1 = __importDefault(require("../controllers/configurations.controller"));
const configurations = (0, express_1.Router)();
// [GET] /api/configurations
configurations.get("/", configurations_controller_1.default.getListConfigurations);
// // [POST] /api/configurations
// configurations.post("/", configurationsController.addConfiguration);
// [PUT] /api/configurations
configurations.put("/", configurations_controller_1.default.updateConfiguration);
exports.default = configurations;
//# sourceMappingURL=configurations.router.js.map