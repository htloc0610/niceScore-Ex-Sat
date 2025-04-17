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
const course_service_1 = __importDefault(require("../services/course.service"));
const logger_1 = require("../config/logger");
const studentController = {
    getListCourse: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courses = yield course_service_1.default.getCourses();
            logger_1.logger.info("Courses fetched successfully");
            res.send({ message: "List of courses", courses });
        }
        catch (error) {
            console.error(error);
            logger_1.logger.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching courses." });
        }
    }),
    //add course
    addCourse: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            console.log(data.course_name, "data course name");
            const newCourse = yield course_service_1.default.addCourse(data.course_name);
            logger_1.logger.info("Course added successfully");
            res.status(201).send({ message: "Course added successfully", newCourse });
        }
        catch (error) {
            console.error(error);
            logger_1.logger.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while adding the course." });
        }
    }),
    //update course
    updateCourse: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { course_id, name } = req.body;
            const updatedData = req.body;
            const updatedCourse = yield course_service_1.default.updateCourse(course_id, updatedData);
            if (!updatedCourse) {
                logger_1.logger.error("Course not found or no changes made");
                res
                    .status(404)
                    .send({ message: "Course not found or no changes made." });
            }
            else {
                logger_1.logger.info("Course updated successfully");
                res.status(200).send({
                    message: "Course updated successfully",
                    updatedCourse,
                });
            }
        }
        catch (error) {
            console.error(error);
            logger_1.logger.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the course." });
        }
    }),
};
exports.default = studentController;
//# sourceMappingURL=course.controller.js.map