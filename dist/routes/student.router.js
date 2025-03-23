"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//this file is API router for student
const express_1 = require("express");
const student_controller_1 = __importDefault(require("../controllers/student.controller"));
const studentRouter = (0, express_1.Router)();
// [GET] /api/student
studentRouter.get("/", student_controller_1.default.getStudentHome);
// [GET] /api/student/:id
studentRouter.get("/:id", student_controller_1.default.getStudentById);
// [PUT] /api/student:/id
studentRouter.put("/:id", student_controller_1.default.updateStudentById);
// [POST] /api/student
studentRouter.post("/", student_controller_1.default.addStudent);
// [PUT] /api/student
studentRouter.put("/", student_controller_1.default.updateStudent);
// [DELETE] /api/student
studentRouter.delete("/", student_controller_1.default.deleteStudent);
exports.default = studentRouter;
//# sourceMappingURL=student.router.js.map