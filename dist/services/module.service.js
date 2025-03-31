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
const logger_1 = require("../config/logger");
const facultyService = {
    getAllModules() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const modules = yield modules_model_1.default.findAll({
                    order: [["module_id", "ASC"]],
                });
                return modules.map(module => module.dataValues);
            }
            catch (error) {
                logger_1.logger.error("Error fetching all modules");
                throw new Error("Error fetching all modules");
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
};
exports.default = facultyService;
//# sourceMappingURL=module.service.js.map