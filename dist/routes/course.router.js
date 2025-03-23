"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = __importDefault(require("../controllers/course.controller"));
const courseRouter = (0, express_1.Router)();
courseRouter.get("/course", course_controller_1.default.getListCourse);
courseRouter.post("/add_course", course_controller_1.default.addCourse);
courseRouter.put("/update_course", course_controller_1.default.updateCourse);
exports.default = courseRouter;
//# sourceMappingURL=course.router.js.map