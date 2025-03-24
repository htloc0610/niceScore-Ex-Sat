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
const status_model_1 = __importDefault(require("../models/status.model"));
const logger_1 = require("../config/logger");
const statusService = {
    // Get list of status
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield status_model_1.default.findAll();
                logger_1.logger.info("Fetched status list successfully");
                return status;
            }
            catch (error) {
                logger_1.logger.error("Error fetching status list: " + error.message);
                throw new Error("Error fetching status list");
            }
        });
    },
    addStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newStatus = yield status_model_1.default.create(data);
                logger_1.logger.info("Added new status successfully");
                return Object.assign({}, newStatus.toJSON());
            }
            catch (error) {
                logger_1.logger.error("Error adding new status: " + error.message);
                throw new Error("Error adding new status: " + error.message);
            }
        });
    },
    updateStatus(statusId, statusData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield status_model_1.default.update(statusData, {
                    where: { status_id: statusId },
                });
                if (updated === 0) {
                    logger_1.logger.error(`Status with id ${statusId} not found`);
                    throw new Error("Status not found");
                }
                const updatedStatus = yield status_model_1.default.findOne({
                    where: { status_id: statusId },
                });
                logger_1.logger.info(`Updated status with id ${statusId} successfully`);
                return updatedStatus ? updatedStatus.get() : null;
            }
            catch (error) {
                logger_1.logger.error(`Error updating status with id ${statusId}: ${error.message}`);
                throw new Error(error.message);
            }
        });
    },
    isAvailable(new_status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield status_model_1.default.findOne({
                    where: { name: new_status },
                });
                return status !== null;
            }
            catch (error) {
                logger_1.logger.error(`Error checking availability of status ${new_status}: ${error.message}`);
                throw new Error("Error checking status availability");
            }
        });
    },
};
exports.default = statusService;
//# sourceMappingURL=status.service.js.map