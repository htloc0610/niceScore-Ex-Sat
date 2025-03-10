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
const student_model_1 = __importDefault(require("../models/student.model"));
const studentService = {
    // Get list of students
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield student_model_1.default.findAll();
                return students;
            }
            catch (error) {
                throw new Error("Error fetching students list");
            }
        });
    },
    // Add a new student
    add(studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newStudent = yield student_model_1.default.create(studentData);
                return newStudent;
            }
            catch (error) {
                throw new Error("Error adding new student");
            }
        });
    },
    // Delete a student by ID
    delete(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield student_model_1.default.destroy({ where: { id: studentId } });
                if (result === 0) {
                    throw new Error("Student not found");
                }
                return result;
            }
            catch (error) {
                throw new Error("Error deleting student");
            }
        });
    },
    // Update a student by ID
    update(studentId, studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield student_model_1.default.update(studentData, {
                    where: { id: studentId },
                });
                if (updated === 0) {
                    throw new Error("Student not found");
                }
                const updatedStudent = yield student_model_1.default.findOne({
                    where: { id: studentId },
                });
                return updatedStudent;
            }
            catch (error) {
                throw new Error("Error updating student");
            }
        });
    },
};
exports.default = studentService;
//# sourceMappingURL=student.service.js.map