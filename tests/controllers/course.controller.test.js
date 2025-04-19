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
const course_controller_1 = __importDefault(require("../../src/controllers/course.controller"));
const course_service_1 = __importDefault(require("../../src/services/course.service"));
const logger_1 = require("../../src/config/logger");
// Mock service và logger
jest.mock("../../src/services/course.service");
jest.mock("../../src/config/logger");
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
};
describe("courseController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getListCourse", () => {
        it("should return list of courses on success", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCourses = [
                { id: 1, name: "Math" },
                { id: 2, name: "Science" },
            ];
            course_service_1.default.getCourses.mockResolvedValue(mockCourses);
            const req = {};
            const res = mockResponse();
            yield course_controller_1.default.getListCourse(req, res);
            expect(course_service_1.default.getCourses).toHaveBeenCalled();
            expect(logger_1.logger.info).toHaveBeenCalledWith("Courses fetched successfully");
            expect(res.send).toHaveBeenCalledWith({
                message: "List of courses",
                courses: mockCourses,
            });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Database error");
            course_service_1.default.getCourses.mockRejectedValue(error);
            const req = {};
            const res = mockResponse();
            yield course_controller_1.default.getListCourse(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while fetching courses.",
            });
        }));
    });
    describe("addCourse", () => {
        it("should add course successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const newCourseData = { course_name: "Physics" };
            const mockNewCourse = Object.assign({ id: 3 }, newCourseData);
            course_service_1.default.addCourse.mockResolvedValue(mockNewCourse);
            const req = { body: newCourseData };
            const res = mockResponse();
            yield course_controller_1.default.addCourse(req, res);
            expect(course_service_1.default.addCourse).toHaveBeenCalledWith("Physics");
            expect(logger_1.logger.info).toHaveBeenCalledWith("Course added successfully");
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                message: "Course added successfully",
                newCourse: mockNewCourse,
            });
        }));
        it("should handle errors when adding course", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error adding course");
            course_service_1.default.addCourse.mockRejectedValue(error);
            const req = { body: { course_name: "Physics" } };
            const res = mockResponse();
            yield course_controller_1.default.addCourse(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while adding the course.",
            });
        }));
    });
    describe("updateCourse", () => {
        it("should update course successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedCourseData = { course_id: 1, name: "Updated Math" };
            const mockUpdatedCourse = Object.assign({ id: 1 }, updatedCourseData);
            course_service_1.default.updateCourse.mockResolvedValue(mockUpdatedCourse);
            const req = { body: updatedCourseData };
            const res = mockResponse();
            yield course_controller_1.default.updateCourse(req, res);
            expect(course_service_1.default.updateCourse).toHaveBeenCalledWith(1, updatedCourseData);
            expect(logger_1.logger.info).toHaveBeenCalledWith("Course updated successfully");
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: "Course updated successfully",
                updatedCourse: mockUpdatedCourse,
            });
        }));
        it("should return 404 if course not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedCourseData = { course_id: 99, name: "Nonexistent Course" };
            course_service_1.default.updateCourse.mockResolvedValue(null);
            const req = { body: updatedCourseData };
            const res = mockResponse();
            yield course_controller_1.default.updateCourse(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith("Course not found or no changes made");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: "Course not found or no changes made.",
            });
        }));
        it("should handle errors when updating course", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error updating course");
            course_service_1.default.updateCourse.mockRejectedValue(error);
            const req = { body: { course_id: 1, name: "Updated Math" } };
            const res = mockResponse();
            yield course_controller_1.default.updateCourse(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith(error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while updating the course.",
            });
        }));
    });
});
//# sourceMappingURL=course.controller.test.js.map