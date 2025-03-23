"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faculty_controller_1 = __importDefault(require("../controllers/faculty.controller"));
const facultyRouter = (0, express_1.Router)();
facultyRouter.get("/faculty", faculty_controller_1.default.getListFaculties);
facultyRouter.post("/add_faculty", faculty_controller_1.default.addFaculty);
facultyRouter.put("/update_faculty", faculty_controller_1.default.updateFaculty);
exports.default = facultyRouter;
//# sourceMappingURL=faculty.router.js.map