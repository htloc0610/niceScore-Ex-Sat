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
const class_registation_service_1 = __importDefault(require("../services/class_registation.service"));
const logger_1 = require("../config/logger");
const classRegistationController = {
    getClassRegistationList: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const registrations = yield class_registation_service_1.default.getAllRegistrations();
            logger_1.logger.info("Successfully fetched class registration list");
            res.send({ message: "List of class registrations", registrations });
        }
        catch (error) {
            logger_1.logger.error("Error fetching class registration list");
            console.error("Error fetching class registration list:", error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching class registrations." });
        }
    }),
    addClassRegistation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const registrationData = req.body;
            if (!registrationData.student_id || !registrationData.class_id) {
                res.status(400).send({
                    message: "Student ID and Class ID are required.",
                });
                return;
            }
            if (yield class_registation_service_1.default.availableRegistration(registrationData)) {
                res.status(409).send({
                    message: "This student is already registered for this class.",
                });
                return;
            }
            if (yield class_registation_service_1.default.fullOfStudent(parseInt(registrationData.class_id))) {
                res.status(409).send({
                    message: "This class is already full.",
                });
                return;
            }
            const createdRegistration = yield class_registation_service_1.default.addRegistration(registrationData);
            res.status(201).send({
                message: "Class registration created successfully",
                createdRegistration,
            });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while creating the class registration." });
        }
    }),
    getClassRegistation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const registration_id = req.params.id; // Extract registration ID from URL params
            const registrationData = yield class_registation_service_1.default.getRegistrationById(parseInt(registration_id));
            if (!registrationData) {
                res.status(404).send({ message: "Registration not found." });
            }
            else {
                res.status(200).send({ message: "Registration fetched successfully", registrationData });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching the registration." });
        }
    }),
    updateClassRegistation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const registration_id = req.params.id;
            const updatedData = req.body;
            if (!updatedData.student_id && !updatedData.class_id) {
                res.status(400).send({
                    message: "At least one of Student ID or Class ID must be provided to update.",
                });
                return;
            }
            const updatedRegistration = yield class_registation_service_1.default.updateRegistration(parseInt(registration_id), updatedData);
            if (!updatedRegistration) {
                res
                    .status(404)
                    .send({ message: "Registration not found or no changes made." });
            }
            else {
                res.status(200).send({
                    message: "Registration updated successfully",
                    updatedRegistration,
                });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the registration." });
        }
    }),
    deleteClassRegistation: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const registration_id = req.params.id;
            const { reason } = req.body;
            if (!reason) {
                res.status(400).send({
                    message: "Reason for cancellation is required.",
                });
                return;
            }
            const deleted = yield class_registation_service_1.default.deleteRegistration(parseInt(registration_id), reason);
            if (!deleted) {
                res.status(404).send({ message: "Registration not found." });
            }
            else {
                res.status(200).send({ message: "Registration deleted successfully." });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while deleting the registration." });
        }
    }),
    //getClassRegistationByClassId
    getClassRegistationByClassId: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const classId = req.params.classId; // Extract class ID from URL params
            const registrations = yield class_registation_service_1.default.getRegistrationsByClassId(parseInt(classId));
            if (!registrations) {
                res.status(404).send({ message: "No registrations found for this class." });
            }
            else {
                res.status(200).send({ message: "Registrations fetched successfully", registrations });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching the registrations." });
        }
    }),
};
exports.default = classRegistationController;
//# sourceMappingURL=class_registation.controller.js.map