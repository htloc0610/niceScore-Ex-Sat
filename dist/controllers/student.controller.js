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
    updateStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { student_id, full_name, date_of_birth, gender, faculty_id, course, program, address, email, phone_number, status } = req.body;
            const updatedData = { full_name, date_of_birth, gender, faculty_id, course, program, address, email, phone_number, status };
            const studentId = parseInt(student_id, 10);
            const updatedStudent = yield student_service_1.default.update(studentId, updatedData);
            if (!updatedStudent) {
                res.status(404).send({ message: "Student not found or no changes made." });
            }
            else {
                res.status(200).send({
                    message: "Student updated successfully",
                    updatedStudent,
                });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred while updating the student." });
        }
    }),
    deleteStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { student_id } = req.body; // Extract the student ID from the request body
            // Call the delete function in your service
            const result = yield student_service_1.default.delete(student_id);
            // If the student was successfully deleted, return a success response
            if (result === 0) {
                res.status(404).send({ message: "Student not found" });
            }
            else {
                res.status(200).send({ message: "Xóa sinh viên thành công!" });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ message: "An error occurred while deleting the student." });
        }
    }),
};
exports.default = studentController;
//# sourceMappingURL=student.controller.js.map