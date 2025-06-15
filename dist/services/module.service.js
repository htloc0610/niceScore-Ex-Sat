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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
const module_translations_model_1 = __importDefault(require("../models/module_translations.model"));
const db_1 = __importDefault(require("../config/db"));
const moduleService = { getAllModules() {
        return __awaiter(this, arguments, void 0, function* (language = "en") {
            try {
                const modules = yield modules_model_1.default.findAll({
                    include: [
                        {
                            model: faculty_model_1.default,
                            as: "faculty",
                            attributes: ["name_en", "name_vi"],
                        },
                        {
                            model: modules_model_1.default,
                            as: "prerequisite",
                            attributes: ["module_code"],
                        },
                        {
                            model: module_translations_model_1.default,
                            as: "translations",
                            where: { language },
                            required: false, // Left join to get modules even if they don't have a translation
                        },
                    ],
                });
                return modules.map((module) => {
                    const plainModule = module.get({ plain: true });
                    // Extract translation data and add it to the module object
                    if (plainModule.translations && plainModule.translations.length > 0) {
                        plainModule.module_name = plainModule.translations[0].module_name;
                        plainModule.description = plainModule.translations[0].description;
                    }
                    else {
                        // Default values if translation is not available
                        plainModule.module_name = `[${plainModule.module_code}]`;
                        plainModule.description = null;
                    }
                    // Remove the translations array from the returned object
                    delete plainModule.translations;
                    return plainModule;
                });
            }
            catch (error) {
                console.error("Error fetching modules:", error);
                throw error;
            }
        });
    },
    getModuleWithTranslations(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const module = yield modules_model_1.default.findOne({
                    where: { module_id: moduleId },
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
                        {
                            model: module_translations_model_1.default,
                            as: "translations",
                        },
                    ],
                });
                if (!module) {
                    throw new Error("Module not found");
                }
                return module.get({ plain: true });
            }
            catch (error) {
                logger_1.logger.error("Error fetching module with translations: " + error.message);
                throw new Error("Error fetching module with translations: " + error.message);
            }
        });
    },
    addModule(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Extract translation data
                const translations = data.translations || [];
                const { module_name, description } = data, moduleData = __rest(data, ["module_name", "description"]);
                // Start transaction to ensure data integrity
                const result = yield db_1.default.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    // Create the module
                    const newModule = yield modules_model_1.default.create(moduleData, { transaction: t });
                    // Add translations if provided
                    if (module_name) {
                        // Create a default English translation if just module_name is provided
                        yield module_translations_model_1.default.create({
                            module_id: newModule.module_id,
                            language: 'en',
                            module_name,
                            description,
                        }, { transaction: t });
                    }
                    // Add any additional translations
                    if (translations.length > 0) {
                        for (const translation of translations) {
                            yield module_translations_model_1.default.create(Object.assign({ module_id: newModule.module_id }, translation), { transaction: t });
                        }
                    }
                    // Return the newly created module
                    return newModule;
                }));
                logger_1.logger.info("Added new module successfully");
                // Get the complete module with translations
                const completeModule = yield this.getModuleWithTranslations(result.module_id);
                return completeModule;
            }
            catch (error) {
                logger_1.logger.error("Error adding new module: " + error.message);
                throw new Error("Error adding new module: " + error.message);
            }
        });
    },
    getModuleById(moduleId_1) {
        return __awaiter(this, arguments, void 0, function* (moduleId, language = "en") {
            try {
                const module = yield modules_model_1.default.findOne({
                    where: { module_id: moduleId },
                    include: [
                        {
                            model: module_translations_model_1.default,
                            as: "translations",
                            where: { language },
                            required: false,
                        },
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
                if (!module) {
                    throw new Error("Module not found");
                }
                const plainModule = module.get({ plain: true });
                // Extract translation data and add it to the module object
                if (plainModule.translations && plainModule.translations.length > 0) {
                    plainModule.module_name = plainModule.translations[0].module_name;
                    plainModule.description = plainModule.translations[0].description;
                }
                else {
                    // Default values if translation is not available
                    plainModule.module_name = `[${plainModule.module_code}]`;
                    plainModule.description = null;
                }
                // Remove the translations array from the returned object
                delete plainModule.translations;
                return plainModule;
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
                // Extract translation data
                const { module_name, description, language = 'en', translations } = updatedData, moduleData = __rest(updatedData, ["module_name", "description", "language", "translations"]);
                yield db_1.default.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                    // Update the core module data
                    if (Object.keys(moduleData).length > 0) {
                        const [updated] = yield modules_model_1.default.update(moduleData, {
                            where: { module_id: moduleId },
                            transaction: t,
                        });
                        if (updated === 0) {
                            throw new Error("Module not found");
                        }
                    }
                    // Update or create the translation in the specified language
                    if (module_name || description) {
                        const [translation, created] = yield module_translations_model_1.default.findOrCreate({
                            where: {
                                module_id: moduleId,
                                language
                            },
                            defaults: {
                                module_id: moduleId,
                                language,
                                module_name: module_name || '',
                                description: description || null,
                            },
                            transaction: t,
                        });
                        if (!created) {
                            // Update existing translation
                            yield translation.update(Object.assign(Object.assign({}, (module_name && { module_name })), (description !== undefined && { description })), { transaction: t });
                        }
                    }
                    // Handle multiple translations update
                    if (translations && Array.isArray(translations)) {
                        for (const translationData of translations) {
                            const { language, module_name, description } = translationData;
                            if (!language)
                                continue;
                            const [translation, created] = yield module_translations_model_1.default.findOrCreate({
                                where: {
                                    module_id: moduleId,
                                    language
                                },
                                defaults: {
                                    module_id: moduleId,
                                    language,
                                    module_name: module_name || '',
                                    description: description || null,
                                },
                                transaction: t,
                            });
                            if (!created) {
                                // Update existing translation
                                yield translation.update(Object.assign(Object.assign({}, (module_name && { module_name })), (description !== undefined && { description })), { transaction: t });
                            }
                        }
                    }
                }));
                // Get the updated module with translations
                return yield this.getModuleWithTranslations(moduleId);
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
    },
    deleteTranslation(moduleId, language) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleted = yield module_translations_model_1.default.destroy({
                    where: {
                        module_id: moduleId,
                        language
                    },
                });
                if (deleted === 0) {
                    throw new Error("Translation not found");
                }
                logger_1.logger.info(`Deleted module translation for language ${language} successfully`);
                return { message: "Module translation deleted successfully" };
            }
            catch (error) {
                logger_1.logger.error("Error deleting module translation: " + error.message);
                throw new Error("Error deleting module translation: " + error.message);
            }
        });
    },
};
exports.default = moduleService;
//# sourceMappingURL=module.service.js.map