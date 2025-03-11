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
const student_service_1 = __importDefault(require("../services/student.service"));
const studentController = {
    getStudentHome: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const students = yield student_service_1.default.getList();
            res.send({ message: "Welcome to the Student Home Page", students });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching students." });
        }
    }),
    getListFaculties: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const faculties = yield student_service_1.default.getFaculties();
            res.send({ message: "List of faculties", faculties });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching faculties." });
        }
    }),
    addStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            const newStudent = yield student_service_1.default.addStudent(data);
            console.log(newStudent);
            res
                .status(201)
                .send({ message: "Student added successfully", newStudent });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while adding the student." });
        }
    }),
};
exports.default = studentController;
//# sourceMappingURL=student.controller.js.map