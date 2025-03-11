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
const faculty_model_1 = __importDefault(require("../models/faculty.model"));
const studentService = {
    // Get list of students
    getList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield student_model_1.default.findAll();
                const studentsWithFaculty = yield Promise.all(students.map((student) => __awaiter(this, void 0, void 0, function* () {
                    const faculty = yield faculty_model_1.default.findOne({
                        where: { faculty_id: student.faculty_id },
                    });
                    return Object.assign(Object.assign({}, student.toJSON()), { facultyName: faculty ? faculty.name : null });
                })));
                return studentsWithFaculty;
            }
            catch (error) {
                throw new Error("Error fetching students list");
            }
        });
    },
    // Get list of faculties
    getFaculties() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faculties = yield faculty_model_1.default.findAll();
                return faculties;
            }
            catch (error) {
                throw new Error("Error fetching faculties list");
            }
        });
    },
    // Add a new student
    addStudent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newStudent = yield student_model_1.default.create(data);
                const faculty = yield faculty_model_1.default.findOne({
                    where: { faculty_id: newStudent.faculty_id },
                });
                return Object.assign(Object.assign({}, newStudent.toJSON()), { facultyName: faculty ? faculty.name : null });
            }
            catch (error) {
                throw new Error("Error adding new student" + error);
            }
        });
    },
    // Delete a student by ID
    delete(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield student_model_1.default.destroy({ where: { student_id: studentId } });
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
                    where: { student_id: studentId },
                });
                if (updated === 0) {
                    throw new Error("Student not found");
                }
                const updatedStudent = yield student_model_1.default.findOne({
                    where: { student_id: studentId },
                });
                return updatedStudent ? updatedStudent.get() : null;
            }
            catch (error) {
                throw new Error("Error updating student");
            }
        });
    },
};
exports.default = studentService;
//# sourceMappingURL=student.service.js.map