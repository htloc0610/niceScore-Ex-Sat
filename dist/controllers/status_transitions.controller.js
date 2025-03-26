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
const status_transitions_service_1 = __importDefault(require("../services/status_transitions.service"));
const logger_1 = require("../config/logger");
const statusTransitionController = {
    checkStatusTransition: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { currentStatus, newStatus } = req.body;
        logger_1.logger.info(`Checking status transition from ${currentStatus} to ${newStatus}`);
        try {
            const isValid = yield status_transitions_service_1.default.checkStatusTransition(currentStatus, newStatus);
            res.status(200).json({ isValid });
        }
        catch (error) {
            logger_1.logger.error(`Error checking status transition: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }),
    getStatusTransitions: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        logger_1.logger.info(`Getting status transitions`);
        try {
            const transitions = yield status_transitions_service_1.default.getStatusTransitions();
            res.status(200).json(transitions);
        }
        catch (error) {
            logger_1.logger.error(`Error getting status transitions: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }),
    addStatusTransitions: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { current_status, new_status } = req.body;
        try {
            const result = yield status_transitions_service_1.default.addStatusTransitions(current_status, new_status);
            logger_1.logger.info(`Adding new status transitions`);
            res.status(201).json(result);
        }
        catch (error) {
            logger_1.logger.error(`Error adding status transitions: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }),
    updateStatusTransitions: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, current_status, new_status } = req.body;
        try {
            const result = yield status_transitions_service_1.default.updateStatusTransitions(id, current_status, new_status);
            logger_1.logger.info(`Updating status transition with id ${id}`);
            res.status(200).json(result);
        }
        catch (error) {
            logger_1.logger.error(`Error updating status transitions: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }),
    deleteStatusTransitions: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        try {
            const result = yield status_transitions_service_1.default.deleteStatusTransitions(parseInt(id, 10));
            if (!result) {
                res.status(404).json({ error: "Status transition not found" });
                return;
            }
            logger_1.logger.info(`Deleted status transition with id ${id}`);
            res.status(200).json({ message: "Status transition deleted successfully" });
        }
        catch (error) {
            logger_1.logger.error(`Error deleting status transition: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    })
};
exports.default = statusTransitionController;
//# sourceMappingURL=status_transitions.controller.js.map