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
const classes_model_1 = __importDefault(require("../models/classes.model"));
const modules_model_1 = __importDefault(require("../models/modules.model"));
const logger_1 = require("../config/logger");
const classService = {
    getAllClasses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classes = yield classes_model_1.default.findAll({
                    order: [["class_id", "ASC"]],
                });
                return classes.map(cls => cls.dataValues);
            }
            catch (error) {
                logger_1.logger.error("Error fetching all classes");
                throw new Error("Error fetching all classes");
            }
        });
    },
    isActive(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const activeClass = yield modules_model_1.default.findOne({
                    where: { module_id: moduleId, is_active: true },
                });
                if (activeClass) {
                    return true;
                }
                return false;
            }
            catch (error) {
                logger_1.logger.error("Error checking if class is active: " + error.message);
                throw new Error("Error checking if class is active: " + error.message);
            }
        });
    },
    createClass(newClassData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdClass = yield classes_model_1.default.create(newClassData);
                logger_1.logger.info("Created new class successfully");
                return createdClass.toJSON();
            }
            catch (error) {
                logger_1.logger.error("Error creating new class: " + error.message);
                throw new Error("Error creating new class: " + error.message);
            }
        });
    },
    getClassById(classId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cls = yield classes_model_1.default.findOne({
                    where: { class_id: classId },
                });
                if (!cls) {
                    throw new Error("Class not found");
                }
                return cls.get();
            }
            catch (error) {
                logger_1.logger.error("Error fetching class by ID: " + error.message);
                throw new Error("Error fetching class by ID: " + error.message);
            }
        });
    },
    updateClass(classId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield classes_model_1.default.update(updatedData, {
                    where: { class_id: classId },
                });
                if (updated === 0) {
                    throw new Error("Class not found");
                }
                const updatedClass = yield classes_model_1.default.findOne({
                    where: { class_id: classId },
                });
                return updatedClass ? updatedClass.get() : null;
            }
            catch (error) {
                logger_1.logger.error("Error updating class: " + error.message);
                throw new Error("Error updating class: " + error.message);
            }
        });
    },
    deleteClass(classId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield classes_model_1.default.destroy({
                    where: { class_id: classId },
                });
                if (deleted === 0) {
                    throw new Error("Class not found");
                }
                logger_1.logger.info(`Deleted class with ID: ${classId}`);
                return { message: "Class deleted successfully" };
            }
            catch (error) {
                logger_1.logger.error("Error deleting class: " + error.message);
                throw new Error("Error deleting class: " + error.message);
            }
        });
    }
};
exports.default = classService;
//# sourceMappingURL=class.service.js.map