"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//this file is API router for student
const express_1 = require("express");
const student_controller_1 = __importDefault(require("../controllers/student.controller"));
const studentRouter = (0, express_1.Router)();
studentRouter.get("/student", student_controller_1.default.getStudentHome);
studentRouter.get("/faculty", student_controller_1.default.getListFaculties);
studentRouter.post("/add_student", student_controller_1.default.addStudent);
exports.default = studentRouter;
//# sourceMappingURL=student.router.js.map