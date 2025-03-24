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
const status_transitions_model_1 = __importDefault(require("../models/status_transitions.model"));
const logger_1 = require("../config/logger");
const statusTransitionService = {
    checkStatusTransition: (currentStatus, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const statusTransition = yield status_transitions_model_1.default.findOne({
                where: { current_status: currentStatus, new_status: newStatus },
            });
            return statusTransition !== null;
        }
        catch (error) {
            logger_1.logger.error("Error checking status transition: " + error.message);
            console.error("Error checking status transition:", error);
            throw error;
        }
    }),
    getStatusTransitions: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const statusTransitions = yield status_transitions_model_1.default.findAll();
            return statusTransitions;
        }
        catch (error) {
            logger_1.logger.error("Error getting status transitions: " + error.message);
            console.error("Error getting status transitions:", error);
            throw error;
        }
    }),
    addStatusTransitions: (current_status, new_status) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const existingTransition = yield status_transitions_model_1.default.findOne({
                where: { current_status, new_status },
            });
            if (existingTransition) {
                throw new Error("Status transition already exists");
            }
            const newStatusTransition = yield status_transitions_model_1.default.create({
                current_status,
                new_status,
            });
            return newStatusTransition;
        }
        catch (error) {
            logger_1.logger.error("Error adding status transition: " + error.message);
            console.error("Error adding status transition:", error);
            throw error;
        }
    }),
    updateStatusTransitions: (id, current_status, new_status) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const statusTransition = yield status_transitions_model_1.default.findByPk(id);
            if (!statusTransition) {
                throw new Error("Status transition not found");
            }
            statusTransition.current_status = current_status;
            statusTransition.new_status = new_status;
            yield statusTransition.save();
            return statusTransition;
        }
        catch (error) {
            logger_1.logger.error("Error updating status transition: " + error.message);
            console.error("Error updating status transition:", error);
            throw error;
        }
    }),
};
exports.default = statusTransitionService;
//# sourceMappingURL=status_transitions.service.js.map