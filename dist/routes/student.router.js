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
studentRouter.get("/student", student_controller_1.default.getStudentHome);
// [GET] /api/student/faculty
studentRouter.get("/faculty", student_controller_1.default.getListFaculties);
// [GET] /api/student/status
studentRouter.get("/status", student_controller_1.default.getListStatus);
// [GET] /api/student/course
studentRouter.get("/course", student_controller_1.default.getListCourse);
// [GET] /api/student/:id
studentRouter.get("/student/:id", student_controller_1.default.getStudentById);
// [PUT] /api/student/:id
studentRouter.put("/student/:id", student_controller_1.default.updateStudentById);
// [POST] /api/student/add_student
studentRouter.post("/add_student", student_controller_1.default.addStudent);
// [PUT] /api/student/update_student
studentRouter.put("/update_student", student_controller_1.default.updateStudent);
// [POST] /api/student/delete_student
studentRouter.post("/delete_student", student_controller_1.default.deleteStudent);
// [POST] /api/student/add_faculty
studentRouter.post("/add_faculty", student_controller_1.default.addFaculty);
// [PUT] /api/student/update_faculty
studentRouter.put("/update_faculty", student_controller_1.default.updateFaculty);
// [POST] /api/student/add_status
studentRouter.post("/add_status", student_controller_1.default.addStatus);
// [PUT] /api/student/update_status
studentRouter.put("/update_status", student_controller_1.default.updateStatus);
// [POST] /api/student/add_course
studentRouter.post("/add_course", student_controller_1.default.addCourse);
// [PUT] /api/student/update_course
studentRouter.put("/update_course", student_controller_1.default.updateCourse);
exports.default = studentRouter;
//# sourceMappingURL=student.router.js.map