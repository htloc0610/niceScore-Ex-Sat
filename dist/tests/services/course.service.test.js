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
const course_service_1 = __importDefault(require("../../src/services/course.service"));
const course_model_1 = __importDefault(require("../../src/models/course.model"));
jest.mock("../../src/models/course.model");
jest.mock("../../src/config/logger", () => ({
    logger: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));
describe("courseService", () => {
    describe("getAllCourses", () => {
        it("should return a list of all courses", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCourses = [
                {
                    dataValues: {
                        course_id: 1,
                        course_name: "Math 101",
                    },
                },
                {
                    dataValues: {
                        course_id: 2,
                        course_name: "Physics 101",
                    },
                },
            ];
            course_model_1.default.findAll.mockResolvedValue(mockCourses);
            const result = yield course_service_1.default.getAllCourses();
            expect(course_model_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual([
                mockCourses[0].dataValues,
                mockCourses[1].dataValues,
            ]);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            course_model_1.default.findAll.mockRejectedValue(new Error("Test error"));
            yield expect(course_service_1.default.getAllCourses()).rejects.toThrow("Error fetching courses list");
        }));
    });
    describe("getCourses", () => {
        it("should return all courses", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCourses = [
                { course_id: 1, course_name: "Math 101" },
                { course_id: 2, course_name: "Physics 101" },
            ];
            course_model_1.default.findAll.mockResolvedValue(mockCourses);
            const result = yield course_service_1.default.getCourses();
            expect(course_model_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockCourses);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            course_model_1.default.findAll.mockRejectedValue(new Error("Test error"));
            yield expect(course_service_1.default.getCourses()).rejects.toThrow("Error fetching courses list");
        }));
    });
    describe("updateCourse", () => {
        it("should update an existing course", () => __awaiter(void 0, void 0, void 0, function* () {
            const courseId = 1;
            const courseData = { course_name: "Math 102" };
            const mockUpdatedCourse = {
                course_id: courseId,
                course_name: "Math 102",
            };
            course_model_1.default.update.mockResolvedValue([1]); // 1 row affected
            course_model_1.default.findOne.mockResolvedValue({
                get: jest.fn(() => mockUpdatedCourse),
            });
            const result = yield course_service_1.default.updateCourse(courseId, courseData);
            expect(course_model_1.default.update).toHaveBeenCalledWith(courseData, {
                where: { course_id: courseId },
            });
            expect(result).toEqual(mockUpdatedCourse);
        }));
        it("should return null if course not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const courseId = 1;
            const courseData = { course_name: "Math 102" };
            course_model_1.default.update.mockResolvedValue([0]); // No rows affected
            yield expect(course_service_1.default.updateCourse(courseId, courseData)).rejects.toThrow("Course not found");
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const courseId = 1;
            const courseData = { course_name: "Math 102" };
            course_model_1.default.update.mockRejectedValue(new Error("Test error"));
            yield expect(course_service_1.default.updateCourse(courseId, courseData)).rejects.toThrow("Test error");
        }));
    });
});
//# sourceMappingURL=course.service.test.js.map