"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const class_controller_1 = __importDefault(require("../controllers/class.controller"));
const classRouter = (0, express_1.Router)();
// [GET] /api/class/module/:id
classRouter.get("/module/:id", class_controller_1.default.getClassByModuleId);
// [GET] /api/class
classRouter.get("/", class_controller_1.default.getListClasses);
// [POST] /api/class
classRouter.post("/", class_controller_1.default.addClass);
// [GET] /api/class/:id
classRouter.get("/:id", class_controller_1.default.getClass);
// [PUT] /api/class/:id
classRouter.put("/:id", class_controller_1.default.updateClass);
// [DELETE] /api/class/:id
classRouter.delete("/:id", class_controller_1.default.deleteClass);
exports.default = classRouter;
//# sourceMappingURL=class.router.js.map