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
const module_service_1 = __importDefault(require("../services/module.service"));
const logger_1 = require("../config/logger");
const facultyController = { getListModules: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Get language from query parameter, defaulting to English
            const language = req.query.language || 'en';
            const modules = yield module_service_1.default.getAllModules(language);
            logger_1.logger.info(`Successfully fetched modules list in ${language} language`);
            res.send({ message: "List of modules", modules });
        }
        catch (error) {
            logger_1.logger.error("Error fetching modules list");
            console.log("Error fetching modules list:", error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching modules." });
        }
    }),
    addModule: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            const { credits } = data;
            if (credits < 2) {
                res.status(400).send({
                    message: "Credits must be at least 2.",
                });
                return;
            }
            const newModule = yield module_service_1.default.addModule(data);
            res
                .status(201)
                .send({ message: "Module added successfully", newModule });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while adding the module." });
        }
    }), getModule: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const module_id = req.params.id; // Extract module ID from URL params
            const language = req.query.language || 'en';
            // Check if translations parameter is provided and true
            const includeTranslations = req.query.translations === 'true';
            let module;
            if (includeTranslations) {
                module = yield module_service_1.default.getModuleWithTranslations(parseInt(module_id));
            }
            else {
                module = yield module_service_1.default.getModuleById(parseInt(module_id), language);
            }
            if (!module) {
                res.status(404).send({ message: "Module not found." });
            }
            else {
                res.status(200).send({ message: "Module fetched successfully", module });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching the module." });
        }
    }),
    updateModule: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const module_id = req.params.id;
            const updatedData = req.body;
            if (updatedData.module_code) {
                res.status(400).send({
                    message: "Cannot change course code after creation.",
                });
                return;
            }
            if (updatedData.credits && (yield module_service_1.default.hasRegisterStudent(parseInt(module_id)))) {
                res.status(400).send({
                    message: "Module cannot be updated because it has registered students.",
                });
                return;
            }
            const updatedModule = yield module_service_1.default.updateModule(parseInt(module_id), updatedData);
            if (!updatedModule) {
                res
                    .status(404)
                    .send({ message: "Module not found or no changes made." });
            }
            else {
                res.status(200).send({
                    message: "Module updated successfully",
                    updatedModule,
                });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the module." });
        }
    }),
    deleteModule: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const module_id = req.params.id;
            if (yield module_service_1.default.isModuleOlderThan30Minutes(parseInt(module_id))) {
                res.status(400).send({
                    message: "Module cannot be deleted after 30 minutes of creation.",
                });
                return;
            }
            if (yield module_service_1.default.hasLinkedClasses(parseInt(module_id))) {
                res.status(400).send({
                    message: "Module cannot be deleted because it has linked classes.",
                });
                return;
            }
            const deletedModule = yield module_service_1.default.deleteModule(parseInt(module_id));
            if (!deletedModule) {
                res.status(404).send({ message: "Module not found." });
            }
            else {
                res.status(200).send({ message: "Module deleted successfully." });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while deleting the module." });
        }
    }),
    getModuleWithTranslations: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const module_id = req.params.id; // Extract module ID from URL params
            const module = yield module_service_1.default.getModuleWithTranslations(parseInt(module_id));
            if (!module) {
                res.status(404).send({ message: "Module not found." });
            }
            else {
                res.status(200).send({ message: "Module with translations fetched successfully", module });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching the module with translations." });
        }
    }),
    addModuleTranslation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const module_id = req.params.id;
            const translationData = req.body;
            if (!translationData.language || !translationData.module_name) {
                res.status(400).send({
                    message: "Language and module name are required for translation.",
                });
                return;
            }
            const updatedModule = yield module_service_1.default.updateModule(parseInt(module_id), {
                translations: [translationData]
            });
            res.status(200).send({
                message: "Module translation added successfully",
                module: updatedModule,
            });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while adding the module translation." });
        }
    }),
    deleteModuleTranslation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const module_id = req.params.id;
            const language = req.params.language;
            if (!language) {
                res.status(400).send({
                    message: "Language parameter is required.",
                });
                return;
            }
            yield module_service_1.default.deleteTranslation(parseInt(module_id), language);
            res.status(200).send({
                message: `Module translation for language '${language}' deleted successfully`,
            });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while deleting the module translation." });
        }
    }),
    getModuleWithLanguage: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const module_id = req.params.id;
            // Get the language from URL parameter, default to English if not provided
            const language = req.params.language || 'en';
            // Use the existing getModuleById method with language parameter
            const module = yield module_service_1.default.getModuleById(parseInt(module_id), language);
            if (!module) {
                res.status(404).send({ message: "Module not found." });
            }
            else {
                res.status(200).send({
                    message: `Module fetched successfully in ${language} language`,
                    module
                });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching the module translation." });
        }
    }),
    addModuleLanguageTranslation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const module_id = req.params.id;
            const language = req.params.language || 'en';
            const { module_name, description } = req.body;
            if (!module_name) {
                res.status(400).send({
                    message: "Module name is required for translation.",
                });
                return;
            }
            // Create a translation object with the language from URL parameter
            const translationData = {
                language,
                module_name,
                description
            };
            const updatedModule = yield module_service_1.default.updateModule(parseInt(module_id), {
                translations: [translationData]
            });
            res.status(200).send({
                message: `Module translation for ${language} added successfully`,
                module: updatedModule,
            });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while adding the module translation." });
        }
    }),
};
exports.default = facultyController;
//# sourceMappingURL=module.controller.js.map