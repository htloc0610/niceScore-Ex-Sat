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
const configurations_model_1 = __importDefault(require("../models/configurations.model"));
const logger_1 = require("../config/logger");
const configurationService = {
    getConfiguration: (configName) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const config = yield configurations_model_1.default.findOne({
                where: { name: configName }
            });
            return config;
        }
        catch (error) {
            logger_1.logger.error("Error getting configuration: " + error.message);
            console.error("Error getting configuration:", error);
            throw error;
        }
        ;
    }),
    configureConfiguration: (configData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newConfig = yield configurations_model_1.default.create(configData);
            return newConfig;
        }
        catch (error) {
            logger_1.logger.error("Error configuring: " + error.message);
            console.error("Error configuring:", error);
            throw error;
        }
        ;
    }),
    addConfiguration: (configData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newConfig = yield configurations_model_1.default.create(configData);
            return newConfig;
        }
        catch (error) {
            logger_1.logger.error("Error adding configuration: " + error.message);
            console.error("Error adding configuration:", error);
            throw error;
        }
    }),
};
exports.default = configurationService;
//# sourceMappingURL=configurations.service.js.map