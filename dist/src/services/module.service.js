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
const modules_model_1 = __importDefault(require("../models/modules.model"));
const faculty_model_1 = __importDefault(require("../models/faculty.model"));
const classes_model_1 = __importDefault(require("../models/classes.model"));
const class_registrations_model_1 = __importDefault(require("../models/class_registrations.model"));
const logger_1 = require("../config/logger");
const moduleService = {
    getAllModules() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modules = yield modules_model_1.default.findAll({
                    include: [
                        {
                            model: faculty_model_1.default,
                            as: "faculty",
                            attributes: ["name"],
                        },
                        {
                            model: modules_model_1.default,
                            as: "prerequisite",
                            attributes: ["module_code"],
                        },
                    ],
                });
                return modules.map((module) => module.get({ plain: true }));
            }
            catch (error) {
                console.error("Error fetching modules:", error);
                throw error;
            }
        });
    },
    addModule(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newModule = yield modules_model_1.default.create(data);
                logger_1.logger.info("Added new module successfully");
                return newModule.toJSON();
            }
            catch (error) {
                logger_1.logger.error("Error adding new module: " + error.message);
                throw new Error("Error adding new module: " + error.message);
            }
        });
    },
    getModuleById(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const module = yield modules_model_1.default.findOne({
                    where: { module_id: moduleId },
                });
                if (!module) {
                    throw new Error("Module not found");
                }
                return module.dataValues;
            }
            catch (error) {
                logger_1.logger.error("Error fetching module by ID: " + error.message);
                throw new Error("Error fetching module by ID: " + error.message);
            }
        });
    },
    hasRegisterStudent(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registeredStudent = yield classes_model_1.default.findOne({
                    where: { module_id: moduleId },
                    include: [
                        {
                            model: class_registrations_model_1.default,
                            as: "registrations",
                            required: true,
                        },
                    ],
                });
                if (registeredStudent) {
                    logger_1.logger.info("Module has registered students");
                    return true;
                }
                else {
                    logger_1.logger.info("Module has no registered students");
                    return false;
                }
            }
            catch (error) {
                logger_1.logger.error("Error checking registered students: " + error.message);
                throw new Error("Error checking registered students: " + error.message);
            }
        });
    },
    updateModule(moduleId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield modules_model_1.default.update(updatedData, {
                    where: { module_id: moduleId },
                });
                if (updated === 0) {
                    throw new Error("Module not found");
                }
                const updatedModule = yield modules_model_1.default.findOne({
                    where: { module_id: moduleId },
                });
                return updatedModule ? updatedModule.get() : null;
            }
            catch (error) {
                logger_1.logger.error("Error updating module: " + error.message);
                throw new Error("Error updating module: " + error.message);
            }
        });
    },
    deleteModule(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield modules_model_1.default.destroy({
                    where: { module_id: moduleId },
                });
                if (deleted === 0) {
                    throw new Error("Module not found");
                }
                logger_1.logger.info("Deleted module successfully");
                return { message: "Module deleted successfully" };
            }
            catch (error) {
                logger_1.logger.error("Error deleting module: " + error.message);
                throw new Error("Error deleting module: " + error.message);
            }
        });
    },
    isModuleOlderThan30Minutes(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const module = yield modules_model_1.default.findOne({
                    where: { module_id: moduleId },
                });
                if (!module) {
                    throw new Error("Module not found");
                }
                const createdAt = module.getDataValue("createdAt");
                const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
                return createdAt < thirtyMinutesAgo;
            }
            catch (error) {
                logger_1.logger.error("Error checking module age: " + error.message);
                throw new Error("Error checking module age: " + error.message);
            }
        });
    },
    hasLinkedClasses(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const linkedClass = yield classes_model_1.default.findOne({
                    where: { module_id: moduleId },
                });
                if (linkedClass) {
                    logger_1.logger.info("Module has linked classes");
                    return true;
                }
                else {
                    logger_1.logger.info("Module has no linked classes");
                    return false;
                }
            }
            catch (error) {
                logger_1.logger.error("Error checking linked classes: " + error.message);
                throw new Error("Error checking linked classes: " + error.message);
            }
        });
    }
};
exports.default = moduleService;
//# sourceMappingURL=module.service.js.map