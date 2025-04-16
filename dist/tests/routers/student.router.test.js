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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const student_router_1 = __importDefault(require("../../src/routes/student.router"));
const student_controller_1 = __importDefault(require("../../src/controllers/student.controller"));
// Mock controller methods
jest.mock("../../src/controllers/student.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/student", student_router_1.default);
describe("Student Router", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("GET /api/student", () => {
        it("should fetch student home successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            student_controller_1.default.getStudentHome.mockImplementation((req, res) => {
                res
                    .status(200)
                    .send({ message: "Student home fetched successfully" });
            });
            const response = yield (0, supertest_1.default)(app).get("/api/student");
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Student home fetched successfully");
            expect(student_controller_1.default.getStudentHome).toHaveBeenCalled();
        }));
    });
    describe("GET /api/student/:id", () => {
        it("should fetch student by ID successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const studentId = 1;
            const mockStudent = { id: studentId, name: "John Doe", age: 20 };
            student_controller_1.default.getStudentById.mockImplementation((req, res) => {
                res.status(200).send({ student: mockStudent });
            });
            const response = yield (0, supertest_1.default)(app).get(`/api/student/${studentId}`);
            expect(response.status).toBe(200);
            expect(response.body.student).toEqual(mockStudent);
            expect(student_controller_1.default.getStudentById).toHaveBeenCalled();
        }));
        it("should return 404 if student not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const studentId = 999;
            student_controller_1.default.getStudentById.mockImplementation((req, res) => {
                res.status(404).send({ message: "Student not found" });
            });
            const response = yield (0, supertest_1.default)(app).get(`/api/student/${studentId}`);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Student not found");
        }));
    });
    describe("POST /api/student", () => {
        it("should add a new student", () => __awaiter(void 0, void 0, void 0, function* () {
            const newStudent = { name: "Jane Doe", age: 22 };
            student_controller_1.default.addStudent.mockImplementation((req, res) => {
                res.status(201).send({
                    message: "Student added successfully",
                    student: newStudent,
                });
            });
            const response = yield (0, supertest_1.default)(app).post("/api/student").send(newStudent);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Student added successfully");
            expect(response.body.student).toEqual(newStudent);
            expect(student_controller_1.default.addStudent).toHaveBeenCalled();
        }));
    });
    describe("PUT /api/student/:id", () => {
        it("should update student by ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const studentId = 1;
            const updatedStudent = {
                id: studentId,
                name: "John Doe Updated",
                age: 21,
            };
            student_controller_1.default.updateStudentById.mockImplementation((req, res) => {
                res.status(200).send({
                    message: "Student updated successfully",
                    student: updatedStudent,
                });
            });
            const response = yield (0, supertest_1.default)(app)
                .put(`/api/student/${studentId}`)
                .send(updatedStudent);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Student updated successfully");
            expect(response.body.student).toEqual(updatedStudent);
            expect(student_controller_1.default.updateStudentById).toHaveBeenCalled();
        }));
        it("should return 404 if student to update not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const studentId = 999;
            const updatedStudent = { name: "John Doe Updated", age: 21 };
            student_controller_1.default.updateStudentById.mockImplementation((req, res) => {
                res.status(404).send({ message: "Student not found" });
            });
            const response = yield (0, supertest_1.default)(app)
                .put(`/api/student/${studentId}`)
                .send(updatedStudent);
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Student not found");
        }));
    });
    describe("DELETE /api/student", () => {
        it("should delete a student", () => __awaiter(void 0, void 0, void 0, function* () {
            const studentId = 1;
            student_controller_1.default.deleteStudent.mockImplementation((req, res) => {
                res.status(200).send({ message: "Student deleted successfully" });
            });
            const response = yield (0, supertest_1.default)(app)
                .delete("/api/student")
                .send({ id: studentId });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Student deleted successfully");
            expect(student_controller_1.default.deleteStudent).toHaveBeenCalled();
        }));
        it("should return 404 if student to delete not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const studentId = 999;
            student_controller_1.default.deleteStudent.mockImplementation((req, res) => {
                res.status(404).send({ message: "Student not found" });
            });
            const response = yield (0, supertest_1.default)(app)
                .delete("/api/student")
                .send({ id: studentId });
            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Student not found");
        }));
    });
});
//# sourceMappingURL=student.router.test.js.map