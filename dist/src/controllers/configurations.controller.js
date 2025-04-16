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
const configurations_service_1 = __importDefault(require("../services/configurations.service"));
const logger_1 = require("../config/logger");
const statusController = {
    getListConfigurations: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const configurations = yield configurations_service_1.default.getAllConfiguration();
            logger_1.logger.info("Fetched list of configurations successfully");
            res.send({ message: "List of configurations", configurations });
        }
        catch (error) {
            logger_1.logger.error("An error occurred while fetching configurations", error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching configurations." });
        }
    }),
    updateConfiguration: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { config_key, config_value } = req.body;
            const data = { config_key, config_value };
            const updatedConfiguration = yield configurations_service_1.default.updateConfiguration(data);
            if (updatedConfiguration) {
                logger_1.logger.info(`Configuration updated successfully`);
                res.send({ message: "Configuration updated successfully", updatedConfiguration });
            }
            else {
                logger_1.logger.error(`Configuration not found`);
                res.status(404).send({ message: "Configuration not found" });
            }
        }
        catch (error) {
            logger_1.logger.error("An error occurred while updating the configuration", error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the configuration." });
        }
    }),
    addConfiguration: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            console.log("data controller", data);
            const newStatus = yield configurations_service_1.default.addConfiguration(data);
            logger_1.logger.info("Status added successfully");
            res.status(201).send({ message: "Status added successfully", newStatus });
        }
        catch (error) {
            logger_1.logger.error("An error occurred while adding the status", error);
            res
                .status(500)
                .send({ message: "An error occurred while adding the status." });
        }
    }),
};
exports.default = statusController;
//# sourceMappingURL=configurations.controller.js.map