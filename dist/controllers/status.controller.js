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
const status_service_1 = __importDefault(require("../services/status.service"));
const logger_1 = require("../config/logger");
const statusController = {
    getListStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const status = yield status_service_1.default.getStatus();
            logger_1.logger.info("Fetched list of status successfully");
            res.send({ message: "List of status", status });
        }
        catch (error) {
            logger_1.logger.error("An error occurred while fetching status", error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching status." });
        }
    }),
    addStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            const newStatus = yield status_service_1.default.addStatus(data);
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
    updateStatus: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { status_id, name } = req.body;
            const updatedData = req.body;
            const updatedStatus = yield status_service_1.default.updateStatus(status_id, updatedData);
            if (!updatedStatus) {
                logger_1.logger.error("Status not found or no changes made", {
                    status_id,
                    name,
                });
                res
                    .status(404)
                    .send({ message: "Status not found or no changes made." });
            }
            else {
                logger_1.logger.info("Status updated successfully", { status_id, name });
                res.status(200).send({
                    message: "Status updated successfully",
                    updatedStatus,
                });
            }
        }
        catch (error) {
            logger_1.logger.error("An error occurred while updating the status", error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the status." });
        }
    }),
};
exports.default = statusController;
//# sourceMappingURL=status.controller.js.map