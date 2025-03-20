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
const identification_model_1 = __importDefault(require("../models/identification.model"));
const logger_1 = require("../config/logger");
const identificationService = {
    addIdentification: (identificationData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newIdentification = yield identification_model_1.default.create(identificationData);
            return newIdentification;
        }
        catch (error) {
            logger_1.logger.error("Error adding identification: " + error.message);
            console.error("Error adding identification:", error);
            throw error;
        }
    }),
    updateIdentification: (identificationId, identificationData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const identification = yield identification_model_1.default.findByPk(identificationId);
            if (!identification) {
                throw new Error("Identification not found");
            }
            yield identification.update(identificationData);
            return identification;
        }
        catch (error) {
            logger_1.logger.error("Error updating identification: " + error.message);
            console.error("Error updating identification:", error);
            throw error;
        }
    }),
};
exports.default = identificationService;
//# sourceMappingURL=identification.service.js.map