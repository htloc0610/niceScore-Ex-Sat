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
const logger_1 = require("../config/logger");
const studentController = {
    getStudentHome: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const students = yield student_service_1.default.getListStudent();
            logger_1.logger.info("Successfully fetched students list");
            res.send({ message: "Welcome to the Student Home Page", students });
        }
        catch (error) {
            logger_1.logger.error("Error fetching students list: " + error.message);
            console.log("Error fetching students list:", error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching students." });
        }
    }),
    //getStudentById
    getStudentById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const student = yield student_service_1.default.getStudentById(parseInt(id, 10));
            if (!student) {
                logger_1.logger.error(`Student with ID ${id} not found`);
                res.status(404).send({ message: "Student not found" });
            }
            else {
                logger_1.logger.info(`Student with ID ${id} found`);
                res.status(200).send({ message: "Student found", student });
            }
        }
        catch (error) {
            logger_1.logger.error("Error fetching student: " + error.message);
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching the student." });
        }
    }),
    //updateStudentById
    updateStudentById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const updatedData = req.body;
            const updatedStudent = yield student_service_1.default.updateStudentById(parseInt(id, 10), updatedData);
            if (!updatedStudent) {
                logger_1.logger.error(`Student with ID ${id} not found or no changes made.`);
                res
                    .status(404)
                    .send({ message: "Student not found or no changes made." });
            }
            else {
                logger_1.logger.info(`Student with ID ${id} updated successfully`);
                res.status(200).send({
                    message: "Student updated successfully",
                    updatedStudent,
                });
            }
        }
        catch (error) {
            logger_1.logger.error("Error updating student: " + error.message);
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the student." });
        }
    }),
    addStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            const newStudent = yield student_service_1.default.addStudent(data);
            logger_1.logger.info("Student added successfully");
            res
                .status(201)
                .send({ message: "Student added successfully", newStudent });
        }
        catch (error) {
            logger_1.logger.error("Error adding new student" + error);
            console.log("Error adding new student:", error);
            res
                .status(500)
                .send({ message: "An error occurred while adding the student." });
        }
    }),
    updateStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { student_id, full_name, date_of_birth, gender, faculty_id, course, program, address, email, phone_number, status, } = req.body;
            const updatedData = req.body;
            const studentId = parseInt(student_id, 10);
            const updatedStudent = yield student_service_1.default.updateStudent(studentId, updatedData);
            if (!updatedStudent) {
                res
                    .status(404)
                    .send({ message: "Student not found or no changes made." });
            }
            else {
                //before sending the response, we need to get Faculty name
                const faculty = yield student_service_1.default.getFacultyName(faculty_id);
                updatedStudent.faculty_id = faculty.name;
                logger_1.logger.info("Student updated successfully");
                res.status(200).send({
                    message: "Student updated successfully",
                    updatedStudent,
                });
            }
        }
        catch (error) {
            logger_1.logger.error("Error updating student" + error);
            console.log("Error updating student:", error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the student." });
        }
    }),
    deleteStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { student_id } = req.body; // Extract the student ID from the request body
            // Call the delete function in your service
            const result = yield student_service_1.default.deleteStudent(student_id);
            // If the student was successfully deleted, return a success response
            if (result === 0) {
                logger_1.logger.error("Student not found");
                res.status(404).send({ message: "Student not found" });
            }
            else {
                logger_1.logger.info("Student deleted successfully");
                res.status(200).send({ message: "Student deleted successfully" });
            }
        }
        catch (error) {
            logger_1.logger.error("Error deleting student" + error);
            console.log("Error deleting student:", error);
            res
                .status(500)
                .send({ message: "An error occurred while deleting the student." });
        }
    }),
};
exports.default = studentController;
//# sourceMappingURL=student.controller.js.map