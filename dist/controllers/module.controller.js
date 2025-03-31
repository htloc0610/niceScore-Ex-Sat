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
const facultyController = {
    getListModules: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const modules = yield module_service_1.default.getAllModules();
            logger_1.logger.info("Successfully fetched modules list");
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
    }),
    getModule: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const module_id = req.params.id; // Extract module ID from URL params
            const module = yield module_service_1.default.getModuleById(parseInt(module_id));
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
    })
};
exports.default = facultyController;
//# sourceMappingURL=module.controller.js.map