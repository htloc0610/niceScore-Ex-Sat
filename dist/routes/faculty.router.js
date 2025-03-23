"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//this file is API router for student
const express_1 = require("express");
const faculty_controller_1 = __importDefault(require("../controllers/faculty.controller"));
const facultyRouter = (0, express_1.Router)();
// [GET] /api/student/faculty
facultyRouter.get("/faculty", faculty_controller_1.default.getListFaculties);
// [POST] /api/student/add_faculty
facultyRouter.post("/add_faculty", faculty_controller_1.default.addFaculty);
// [PUT] /api/student/update_faculty
facultyRouter.put("/update_faculty", faculty_controller_1.default.updateFaculty);
exports.default = facultyRouter;
//# sourceMappingURL=faculty.router.js.map