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
const configurations_service_1 = __importDefault(require("../services/configurations.service"));
const status_transitions_model_1 = __importDefault(require("../models/status_transitions.model"));
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
    getStudentById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const studentId = parseInt(id, 10);
            // Check if studentId is a valid number
            if (isNaN(studentId)) {
                logger_1.logger.error(`Invalid student ID: ${id}`);
                res.status(400).send({
                    message: "Invalid student ID",
                    error: `The provided ID '${id}' is not a valid number`
                });
                return;
            }
            const student = yield student_service_1.default.getStudentById(studentId);
            if (!student) {
                logger_1.logger.error(`Student with ID ${id} not found`);
                res.status(404).send({
                    message: "Student not found",
                    error: `No student found with ID ${id}`
                });
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
                .send({
                message: "An error occurred while fetching the student.",
                error: error.message
            });
        }
    }),
    updateStudentById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const studentId = parseInt(id, 10);
            // Check if studentId is a valid number
            if (isNaN(studentId)) {
                logger_1.logger.error(`Invalid student ID for update: ${id}`);
                res.status(400).send({
                    message: "Invalid student ID",
                    error: `The provided ID '${id}' is not a valid number`
                });
                return;
            }
            const updatedData = req.body;
            const email = updatedData.email;
            const phone_number = updatedData.phone_number;
            // Check if the student exists before proceeding
            const existingStudent = yield student_service_1.default.getStudentById(studentId);
            if (!existingStudent) {
                logger_1.logger.error(`Student with ID ${id} not found for update`);
                res.status(404).send({
                    message: "Student not found",
                    error: `No student found with ID ${id}`
                });
                return;
            }
            // Check if the email domain is allowed
            const emailConfig = yield configurations_service_1.default.getConfiguration("allowed_email_domain");
            const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@${emailConfig.config_value}$`);
            if (email && !emailRegex.test(email)) {
                logger_1.logger.error("Invalid email domain");
                res
                    .status(400)
                    .send({
                    message: `Invalid email domain. Please use a ${emailConfig.config_value} email.`,
                });
                return;
            }
            // Check if the phone number is valid
            const phoneConfig = yield configurations_service_1.default.getConfiguration("phone_country_code");
            const phoneRegex = new RegExp(phoneConfig.config_value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
            if (phone_number && !phoneRegex.test(phone_number)) {
                logger_1.logger.error("Invalid phone number");
                res
                    .status(400)
                    .send({
                    message: "Invalid phone number. Please use a valid phone number.",
                });
                return;
            }
            // Check if the status transition is allowed
            const currentStatus = yield student_service_1.default.getStudentStatus(studentId);
            const newStatus = updatedData.status_id;
            console.log("currentStatus:", currentStatus);
            console.log("newStatus:", newStatus);
            // Don't check status transition if the status hasn't changed
            if (currentStatus != newStatus) {
                const statusTransition = yield status_transitions_model_1.default.findOne({
                    where: { current_status: currentStatus, new_status: newStatus },
                });
                if (!statusTransition) {
                    logger_1.logger.error("Invalid status transition");
                    res.status(400).send({ message: "Invalid status transition." });
                    return;
                }
            }
            const updated = yield student_service_1.default.updateStudentById(studentId, updatedData);
            res.status(200).send({ message: "Student updated successfully", student: updated });
        }
        catch (error) {
            logger_1.logger.error("Error updating student: " + error.message);
            console.error(error);
            res
                .status(500)
                .send({
                message: "An error occurred while updating the student.",
                error: error.message
            });
        }
    }),
    addStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            // Check if the email domain is allowed
            const emailConfig = yield configurations_service_1.default.getConfiguration("allowed_email_domain");
            const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@${emailConfig.config_value}$`);
            if (!emailRegex.test(data.email)) {
                logger_1.logger.error("Invalid email domain");
                res
                    .status(400)
                    .send({
                    message: `Invalid email domain. Please use a ${emailConfig.config_value} email.`,
                });
                return;
            }
            // Check if the phone number is valid
            const phoneConfig = yield configurations_service_1.default.getConfiguration("phone_country_code");
            const phoneRegex = new RegExp(phoneConfig.config_value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
            if (!phoneRegex.test(data.phone_number)) {
                logger_1.logger.error("Invalid phone number");
                res
                    .status(400)
                    .send({
                    message: "Invalid phone number. Please use a valid phone number.",
                });
                return;
            }
            const newStudent = yield student_service_1.default.addStudent(data);
            //const newStudent = "ok";
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
            // Check if the email domain is allowed
            const emailConfig = yield configurations_service_1.default.getConfiguration("allowed_email_domain");
            const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@${emailConfig.config_value}$`);
            if (email && !emailRegex.test(email)) {
                logger_1.logger.error("Invalid email domain");
                res
                    .status(400)
                    .send({
                    message: `Invalid email domain. Please use a ${emailConfig.config_value} email.`,
                });
                return;
            }
            // Check if the phone number is valid
            const phoneConfig = yield configurations_service_1.default.getConfiguration("phone_country_code");
            const phoneRegex = new RegExp(phoneConfig.config_value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
            if (phone_number && !phoneRegex.test(phone_number)) {
                logger_1.logger.error("Invalid phone number");
                res
                    .status(400)
                    .send({
                    message: "Invalid phone number. Please use a valid phone number.",
                });
                return;
            }
            // Check if the status transition is allowed
            const currentStatus = yield student_service_1.default.getStudentStatus(studentId);
            const newStatus = status;
            const statusTransition = yield status_transitions_model_1.default.findOne({
                where: { current_status: currentStatus, new_status: newStatus },
            });
            if (!statusTransition) {
                logger_1.logger.error("Invalid status transition");
                res.status(400).send({ message: "Invalid status transition." });
                return;
            }
            const updatedStudent = yield student_service_1.default.updateStudent(studentId, updatedData);
            if (!updatedStudent) {
                res
                    .status(404)
                    .send({ message: "Student not found or no changes made." });
            }
            else {
                //before sending the response, we need to get Faculty name
                const faculty = yield student_service_1.default.getFacultyName(faculty_id);
                updatedStudent.faculty_name_en = faculty.name_en;
                updatedStudent.faculty_name_vn = faculty.name_vi;
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
            const { student_id } = req.body;
            const result = yield student_service_1.default.deleteStudent(student_id);
            // Log để kiểm tra dữ liệu trả về
            logger_1.logger.info("Delete result:", result);
            // Xử lý tùy theo kiểu trả về
            const isDeleted = typeof result === 'number' ? result > 0 : (result === null || result === void 0 ? void 0 : result.affectedRows) > 0;
            if (isDeleted) {
                logger_1.logger.info(`Student with ID ${student_id} deleted successfully`);
                res.status(200).json({ message: "Student deleted successfully" });
            }
            else {
                logger_1.logger.warn(`Student with ID ${student_id} not found`);
                res.status(404).json({ message: "Student not found" });
            }
        }
        catch (error) {
            logger_1.logger.error("Error deleting student:", error);
            res.status(500).send({
                message: "An error occurred while deleting the student."
            });
        }
    }),
};
exports.default = studentController;
//# sourceMappingURL=student.controller.js.map