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
studentRouter.get("/status", student_controller_1.default.getListStatus);
studentRouter.get("/course", student_controller_1.default.getListCourse);
studentRouter.get("/student/:id", student_controller_1.default.getStudentById);
studentRouter.put("/student/:id", student_controller_1.default.updateStudentById);
studentRouter.post("/add_student", student_controller_1.default.addStudent);
studentRouter.put("/update_student", student_controller_1.default.updateStudent);
studentRouter.post('/delete_student', student_controller_1.default.deleteStudent);
studentRouter.post("/add_faculty", student_controller_1.default.addFaculty);
studentRouter.put("/update_faculty", student_controller_1.default.updateFaculty);
studentRouter.post("/add_status", student_controller_1.default.addStatus);
studentRouter.put("/update_status", student_controller_1.default.updateStatus);
studentRouter.post("/add_course", student_controller_1.default.addCourse);
studentRouter.put("/update_course", student_controller_1.default.updateCourse);
exports.default = studentRouter;
//# sourceMappingURL=student.router.js.map