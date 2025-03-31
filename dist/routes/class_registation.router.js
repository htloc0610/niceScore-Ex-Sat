"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const class_registation_controller_1 = __importDefault(require("../controllers/class_registation.controller"));
const classRegistationRouter = (0, express_1.Router)();
// [GET] /api/class_registation
classRegistationRouter.get("/", class_registation_controller_1.default.getClassRegistationList);
// [POST] /api/class_registation
classRegistationRouter.post("/", class_registation_controller_1.default.addClassRegistation);
// [GET] /api/class_registation/:id
classRegistationRouter.get("/:id", class_registation_controller_1.default.getClassRegistation);
// // [PUT] /api/class_registation/:id
// classRegistationRouter.put("/:id", classRegistationController.updateClassRegistation);
// [DELETE] /api/class_registation/:id
classRegistationRouter.delete("/:id", class_registation_controller_1.default.deleteClassRegistation);
exports.default = classRegistationRouter;
//# sourceMappingURL=class_registation.router.js.map