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
const class_service_1 = __importDefault(require("../services/class.service"));
const logger_1 = require("../config/logger");
const classController = {
    getListClasses: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const classes = yield class_service_1.default.getAllClasses();
            logger_1.logger.info("Successfully fetched classes list");
            res.send({ message: "List of classes", classes });
        }
        catch (error) {
            logger_1.logger.error("Error fetching classes list");
            console.error("Error fetching classes list:", error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching classes." });
        }
    }),
    addClass: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newClassData = req.body;
            if (!newClassData.class_name || !newClassData.instructor) {
                res.status(400).send({
                    message: "Class name and instructor are required.",
                });
                return;
            }
            if (!(yield class_service_1.default.isActive(newClassData.module_id))) {
                res.status(400).send({
                    message: "The module is deactivated.",
                });
                return;
            }
            const createdClass = yield class_service_1.default.createClass(newClassData);
            res.status(201).send({
                message: "Class created successfully",
                createdClass,
            });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while creating the class." });
        }
    }),
    getClass: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const class_id = req.params.id; // Extract class ID from URL params
            const classData = yield class_service_1.default.getClassById(parseInt(class_id));
            if (!classData) {
                res.status(404).send({ message: "Class not found." });
            }
            else {
                res.status(200).send({ message: "Class fetched successfully", classData });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching the class." });
        }
    }),
    updateClass: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const class_id = req.params.id;
            const updatedData = req.body;
            if (updatedData.class_code) {
                res.status(400).send({
                    message: "Cannot change class code after creation.",
                });
                return;
            }
            const updatedClass = yield class_service_1.default.updateClass(parseInt(class_id), updatedData);
            if (!updatedClass) {
                res
                    .status(404)
                    .send({ message: "Class not found or no changes made." });
            }
            else {
                res.status(200).send({
                    message: "Class updated successfully",
                    updatedClass,
                });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the class." });
        }
    }),
    deleteClass: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const class_id = req.params.id;
            const deletedClass = yield class_service_1.default.deleteClass(parseInt(class_id));
            if (!deletedClass) {
                res.status(404).send({ message: "Class not found." });
            }
            else {
                res.status(200).send({
                    message: "Class deleted successfully",
                });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while deleting the class." });
        }
    }),
    getClassByModuleId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const module_id = req.params.id; // Extract module ID from URL params
            const classes = yield class_service_1.default.getClassByModuleId(parseInt(module_id));
            if (!classes) {
                res.status(404).send({ message: "Classes not found." });
            }
            else {
                res.status(200).send({ message: "Classes fetched successfully", classes });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching the classes." });
        }
    }),
};
exports.default = classController;
//# sourceMappingURL=class.controller.js.map