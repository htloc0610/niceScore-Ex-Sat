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
function getLocalizedFaculty(faculty, lang) {
    return {
        faculty_id: faculty.faculty_id,
        name: lang === 'vi' ? faculty.name_vi : faculty.name_en
    };
}
function getLocalizedStatus(status, lang) {
    return {
        status_id: status.status_id,
        name: lang === 'vi' ? status.name_vi : status.name_en
    };
}
// [GET] /more
router.get("/more", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lang = res.locals.lang || 'en';
    var faculties = yield faculty_service_1.default.getAllFaculties();
    faculties = faculties.map(faculty => getLocalizedFaculty(faculty, lang || 'en'));
    var statuses = yield status_service_1.default.getAllStatuses();
    statuses = statuses.map(status => getLocalizedStatus(status, lang || 'en'));
    const courses = yield course_service_1.default.getAllCourses();
    const modules = yield module_service_1.default.getAllModules(lang);
    res.render("more", {
        faculties: faculties,
        statuses: statuses,
        courses: courses,
        modules: modules,
        lang: lang
    }); // Render the "more" Handlebars template with language
}));
// [GET] /add
router.get("/add", (req, res) => {
    const lang = res.locals.lang || 'en';
    res.render("add", { lang: lang }); // Render the "add" Handlebars template with language
});
// [GET] /configuration
router.get("/configurations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const configurations = yield configurations_service_1.default.getAllConfiguration(); // Get the configurations from the service
    const lang = res.locals.lang || 'en';
    res.render("configurations", {
        configurations: configurations,
        lang: lang
    }); // Render the "configurations" Handlebars template with language
}));
// [GET] /module
router.get("/module", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lang = res.locals.lang || 'en';
    const modules = yield module_service_1.default.getAllModules(lang); // Get the modules from the service with language
    res.render("module", { modules: modules, lang: lang }); // Render the "class" Handlebars template with language
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
    const lang = res.locals.lang || 'en';
    // console.log(students);
    res.render("class", {
        classes: classData, // Ensure this matches the template variable
        students: students || [], // Ensure students is always an array
        lang: lang // Add language
    });
}));
// [GET] /:id
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lang = res.locals.lang || 'en';
        const studentId = req.params.id;
        console.log("Fetching details for student ID:", studentId);
        // Fetch student data from the database
        const student = yield student_service_1.default.getStudentById(parseInt(studentId, 10));
        if (!student) {
            return res.status(404).render("error", {
                message: lang === 'en' ? "Student not found" : "Không tìm thấy sinh viên",
                lang: lang
            });
        }
        // Convert Sequelize model to plain object
        const studentData = student.get({ plain: true });
        // Render the "detail" Handlebars template with the student data and language
        res.render("detail", {
            id: studentId,
            student: studentData,
            lang: lang
        });
    }
    catch (error) {
        console.error('Error fetching student details:', error);
        res.status(500).render("error", {
            message: res.locals.lang === 'en' ? "An error occurred while fetching student details." : "Đã xảy ra lỗi khi lấy thông tin sinh viên.",
            lang: res.locals.lang || 'en'
        });
    }
}));
// [GET] /
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lang = res.locals.lang || 'en';
    var faculties = yield faculty_service_1.default.getAllFaculties();
    faculties = faculties.map(faculty => getLocalizedFaculty(faculty, lang));
    const studentsDataValue = yield student_service_1.default.getListStudent();
    var students = studentsDataValue.map(student => student.get({ plain: true }));
    students = students.map(student => {
        return Object.assign(Object.assign({}, student), { faculty: getLocalizedFaculty(student.faculty, lang), status: getLocalizedStatus(student.status, lang) // Localize status names
         });
    });
    res.render("index", { faculties: faculties, students: students, lang: lang }); // Render the "index" Handlebars template
}));
exports.default = router;
//# sourceMappingURL=front.router.js.map