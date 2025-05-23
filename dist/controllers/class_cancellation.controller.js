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
const class_cancellation_service_1 = __importDefault(require("../services/class_cancellation.service"));
const logger_1 = require("../config/logger");
const classRegistationController = {
    getClassCancellationList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const cancellations = yield class_cancellation_service_1.default.getAllCancellations();
            logger_1.logger.info("Successfully fetched class cancellation list");
            res.send({ message: "List of class cancellations", cancellations });
        }
        catch (error) {
            logger_1.logger.error("Error fetching class cancellation list", { error });
            res.status(500).send({
                message: "An error occurred while fetching class cancellations.",
            });
        }
    }),
    getClassCancellationDetails: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { moduleID } = req.params;
            const cancellationDetails = yield class_cancellation_service_1.default.getCancellationDetails(moduleID);
            if (!cancellationDetails) {
                logger_1.logger.warn(`No cancellation details found for moduleID: ${moduleID}`);
                res.status(404).send({
                    message: `No cancellation details found for moduleID: ${moduleID}`,
                });
                return;
            }
            logger_1.logger.info(`Successfully fetched cancellation details for moduleID: ${moduleID}`);
            res.send({
                message: `Cancellation details for moduleID: ${moduleID}`,
                cancellationDetails,
            });
        }
        catch (error) {
            logger_1.logger.error("Error fetching class cancellation details", { error });
            res.status(500).send({
                message: "An error occurred while fetching class cancellation details.",
            });
        }
    }),
    getRegistrationCancellationsByStudentId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { studentId } = req.params;
            const student_number = parseInt(studentId, 10);
            const cancellations = yield class_cancellation_service_1.default.getCancellationsByStudentId(student_number);
            if (!cancellations) {
                logger_1.logger.warn(`No cancellation details found for studentId: ${studentId}`);
                res.status(404).send({
                    message: `No cancellation details found for studentId: ${studentId}`,
                });
                return;
            }
            logger_1.logger.info(`Successfully fetched cancellation details for studentId: ${studentId}`);
            res.send({
                message: `Cancellation details for studentId: ${studentId}`,
                cancellations,
            });
        }
        catch (error) {
            logger_1.logger.error("Error fetching class cancellation details", { error });
            res.status(500).send({
                message: "An error occurred while fetching class cancellation details by student ID.",
            });
        }
    }),
};
exports.default = classRegistationController;
//# sourceMappingURL=class_cancellation.controller.js.map