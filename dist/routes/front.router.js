"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configurations_service_1 = __importDefault(require("../services/configurations.service"));
const faculty_service_1 = __importDefault(require("../services/faculty.service"));
const status_service_1 = __importDefault(require("../services/status.service"));
const course_service_1 = __importDefault(require("../services/course.service"));
const student_service_1 = __importDefault(require("../services/student.service"));
const module_service_1 = __importDefault(require("../services/module.service"));
const class_service_1 = __importDefault(require("../services/class.service"));
const class_registation_service_1 = __importDefault(require("../services/class_registation.service"));
const router = (0, express_1.Router)();
// [GET] /more
router.get("/more", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const faculties = yield faculty_service_1.default.getAllFaculties();
    const statuses = yield status_service_1.default.getAllStatuses();
    const courses = yield course_service_1.default.getAllCourses();
    const modules = yield module_service_1.default.getAllModules();
    res.render("more", { faculties: faculties, statuses: statuses, courses: courses, modules: modules }); // Render the "more" Handlebars template
}));
// [GET] /add
router.get("/add", (req, res) => {
    res.render("add"); // Render the "add" Handlebars template
});
// [GET] /configuration
router.get("/configurations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const configurations = yield configurations_service_1.default.getAllConfiguration(); // Get the configurations from the service
    res.render("configurations", { configurations: configurations }); // Render the "configurations" Handlebars template
}));
// [GET] /module
router.get("/module", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const modules = yield module_service_1.default.getAllModules(); // Get the modules from the service
    res.render("module", { modules: modules }); // Render the "class" Handlebars template
}));
// [GET] /class
router.get("/class/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idInt = parseInt(req.params.id, 10); // Convert the ID to an integer
    if (isNaN(idInt)) {
        return res.status(400).render("error", { message: "Invalid class ID" });
    }
    // Get class details
    const classData = yield class_service_1.default.getClassById(idInt);
    if (!classData) {
        return res.status(404).render("error", { message: "Class not found" });
    }
    // Get students in class
    const students = yield class_registation_service_1.default.getRegistrationsByClassId(idInt);
    // console.log(students);
    res.render("class", {
        classes: classData, // Ensure this matches the template variable
        students: students || [], // Ensure students is always an array
    });
}));
// [GET] /:id
router.get("/:id", (req, res) => {
    res.render("detail", { id: req.params.id }); // Render the "detail" Handlebars template with the id parameter
});
// [GET] /
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const faculties = yield faculty_service_1.default.getAllFaculties();
    faculties.unshift({ faculty_id: "", name: "Tất cả khoa" });
    const studentsDataValue = yield student_service_1.default.getListStudent();
    const students = studentsDataValue.map(student => student.get({ plain: true }));
    // console.log(students);
    res.render("index", { faculties: faculties, students: students }); // Render the "index" Handlebars template
}));
exports.default = router;
//# sourceMappingURL=front.router.js.map