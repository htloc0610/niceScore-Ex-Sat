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
const course_model_1 = __importDefault(require("../models/course.model"));
const logger_1 = require("../config/logger");
const courseService = {
    //get Courses
    getAllCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield course_model_1.default.findAll({
                    order: [["course_id", "ASC"]],
                });
                return courses.map(course => course.dataValues);
            }
            catch (error) {
                logger_1.logger.error("Error fetching courses list", error);
                throw new Error("Error fetching courses list");
            }
        });
    },
    //getCourses
    getCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info("Fetching all courses");
                const courses = yield course_model_1.default.findAll();
                return courses;
            }
            catch (error) {
                logger_1.logger.error("Error fetching courses list", error);
                throw new Error("Error fetching courses list");
            }
        });
    },
    addCourse(course_name_en_1) {
        return __awaiter(this, arguments, void 0, function* (course_name_en, course_name_vi = '') {
            try {
                logger_1.logger.info("Adding a new course", { course_name_en, course_name_vi });
                const newCourse = yield course_model_1.default.create({
                    course_name_en,
                    course_name_vi: course_name_vi || course_name_en // Default to English name if Vietnamese is not provided
                });
                return newCourse.toJSON();
            }
            catch (error) {
                logger_1.logger.error("Error adding new course: " + error.message);
                throw new Error("Error adding new course: " + error.message);
            }
        });
    },
    //update course
    updateCourse(courseId, courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.logger.info(`Updating course with ID: ${courseId}`);
                // Make sure we're using the correct field names
                const updateData = {
                    course_name_en: courseData.course_name_en,
                    course_name_vi: courseData.course_name_vi
                };
                const [updated] = yield course_model_1.default.update(updateData, {
                    where: { course_id: courseId },
                });
                if (updated === 0) {
                    logger_1.logger.error(`Course with ID: ${courseId} not found`);
                    throw new Error("Course not found");
                }
                const updatedCourse = yield course_model_1.default.findOne({
                    where: { course_id: courseId },
                });
                logger_1.logger.info(`Course with ID: ${courseId} updated successfully`);
                return updatedCourse ? updatedCourse.get() : null;
            }
            catch (error) {
                logger_1.logger.error(`Error updating course with ID: ${courseId}`, error);
                throw new Error(error.message);
            }
        });
    },
};
exports.default = courseService;
//# sourceMappingURL=course.service.js.map