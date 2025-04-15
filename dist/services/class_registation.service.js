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
const class_registrations_model_1 = __importDefault(require("../models/class_registrations.model"));
const registration_cancellations_model_1 = __importDefault(require("../models/registration_cancellations.model"));
const student_model_1 = __importDefault(require("../models/student.model"));
const classes_model_1 = __importDefault(require("../models/classes.model"));
const transcripts_model_1 = __importDefault(require("../models/transcripts.model"));
const modules_model_1 = __importDefault(require("../models/modules.model"));
const logger_1 = require("../config/logger");
const sequelize_1 = require("sequelize");
const classRegistationService = {
    getAllRegistrations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registrations = yield class_registrations_model_1.default.findAll({
                    include: [
                        {
                            model: student_model_1.default,
                            as: "student",
                            attributes: ["student_id", "full_name", "email"],
                        },
                        {
                            model: classes_model_1.default,
                            as: "class",
                            attributes: [
                                "class_id",
                                "class_name",
                                "academic_year",
                                "module_id",
                                "instructor",
                                "schedule",
                                "classroom",
                            ],
                        },
                    ],
                    order: [["registration_id", "ASC"]],
                });
                return registrations.map((reg) => reg.dataValues);
            }
            catch (error) {
                logger_1.logger.error("Error fetching all registrations");
                throw new Error("Error fetching all registrations");
            }
        });
    },
    hasPrerequisiteCompleted(class_id, student_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(class_id, student_id);
                // Find the class by class_id
                const classDetails = yield classes_model_1.default.findByPk(class_id);
                if (!classDetails) {
                    throw new Error("Class not found");
                }
                // Get the module_id of the class
                const module_id = classDetails.module_id;
                // Find the module by module_id
                const moduleDetails = yield modules_model_1.default.findByPk(module_id);
                if (!moduleDetails) {
                    throw new Error("Module not found");
                }
                console.log(moduleDetails);
                // Check the prerequisite_id of the module
                const prerequisite_id = moduleDetails.prerequisite_id;
                console.log(prerequisite_id);
                // If no prerequisite, return true
                if (!prerequisite_id) {
                    return true;
                }
                // Find all classes belonging to the prerequisite module
                const prerequisiteClasses = yield classes_model_1.default.findAll({
                    where: { module_id: prerequisite_id },
                });
                // Extract class_ids of prerequisite classes
                const prerequisiteClassIds = prerequisiteClasses.map((cls) => cls.class_id);
                // Check the Transcript table for the student
                const transcriptRecord = yield transcripts_model_1.default.findOne({
                    where: {
                        student_id: student_id,
                        class_id: prerequisiteClassIds,
                        grade: { [sequelize_1.Op.gte]: 5 }, // grade >= 5
                    },
                });
                // If at least one record exists, return true
                return !!transcriptRecord;
            }
            catch (error) {
                logger_1.logger.error(`Error checking prerequisite completion for class ID ${class_id} and student ID ${student_id}: ${error.message}`);
                throw new Error(`Error checking prerequisite completion: ${error.message}`);
            }
        });
    },
    availableRegistration(registrationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingRegistration = yield class_registrations_model_1.default.findOne({
                    where: {
                        student_id: registrationData.student_id,
                        class_id: registrationData.class_id,
                    },
                });
                if (existingRegistration) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                logger_1.logger.error("Error checking existing registration: " + error.message);
                throw new Error("Error checking existing registration: " + error.message);
            }
        });
    },
    fullOfStudent(classId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const classDetails = yield classes_model_1.default.findOne({
                    where: { class_id: classId },
                    attributes: ["max_students"],
                });
                if (!classDetails) {
                    throw new Error("Class not found");
                }
                const totalRegistrations = yield class_registrations_model_1.default.count({
                    where: { class_id: classId },
                });
                return totalRegistrations >= classDetails.max_students;
            }
            catch (error) {
                logger_1.logger.error("Error checking if class is full: " + error.message);
                throw new Error("Error checking if class is full: " + error.message);
            }
        });
    },
    addRegistration(newRegistrationData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdRegistration = yield class_registrations_model_1.default.create(newRegistrationData);
                logger_1.logger.info("Created new registration successfully");
                return createdRegistration.toJSON();
            }
            catch (error) {
                logger_1.logger.error("Error creating new registration: " + error.message);
                throw new Error("Error creating new registration: " + error.message);
            }
        });
    },
    getRegistrationById(registrationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registration = yield class_registrations_model_1.default.findOne({
                    where: { registration_id: registrationId },
                    include: [
                        {
                            model: student_model_1.default,
                            as: "student",
                            attributes: ["student_id", "full_name", "email"],
                        },
                        {
                            model: classes_model_1.default,
                            as: "class",
                            attributes: [
                                "class_id",
                                "class_name",
                                "academic_year",
                                "module_id",
                                "instructor",
                                "schedule",
                                "classroom",
                            ],
                        },
                    ],
                });
                if (!registration) {
                    throw new Error("Registration not found");
                }
                return registration.get();
            }
            catch (error) {
                logger_1.logger.error("Error fetching registration by ID: " + error.message);
                throw new Error("Error fetching registration by ID: " + error.message);
            }
        });
    },
    updateRegistration(registrationId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield class_registrations_model_1.default.update(updatedData, {
                    where: { registration_id: registrationId },
                });
                if (updated === 0) {
                    throw new Error("Registration not found");
                }
                const updatedRegistration = yield class_registrations_model_1.default.findOne({
                    where: { registration_id: registrationId },
                });
                return updatedRegistration ? updatedRegistration.get() : null;
            }
            catch (error) {
                logger_1.logger.error("Error updating registration: " + error.message);
                throw new Error("Error updating registration: " + error.message);
            }
        });
    },
    deleteRegistration(registrationId, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registration = yield class_registrations_model_1.default.findOne({
                    where: { registration_id: registrationId },
                });
                if (!registration) {
                    throw new Error("Registration not found");
                }
                // Save cancellation reason to the registration_cancellations table
                yield registration_cancellations_model_1.default.create({
                    student_id: registration.student_id,
                    class_id: registration.class_id,
                    reason: reason,
                });
                // Delete the registration
                const deleted = yield class_registrations_model_1.default.destroy({
                    where: { registration_id: registrationId },
                });
                if (deleted === 0) {
                    throw new Error("Failed to delete registration");
                }
                logger_1.logger.info(`Deleted registration with ID: ${registrationId} and saved cancellation reason`);
                return {
                    message: "Registration deleted successfully and cancellation reason saved",
                };
            }
            catch (error) {
                logger_1.logger.error("Error deleting registration: " + error.message);
                throw new Error("Error deleting registration: " + error.message);
            }
        });
    },
    //getRegistrationsByClassId
    getRegistrationsByClassId(classId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registrations = yield class_registrations_model_1.default.findAll({
                    where: { class_id: classId },
                    include: [
                        {
                            model: student_model_1.default,
                            as: "student",
                            attributes: ["student_id", "full_name", "email", "phone_number"],
                            include: [
                                {
                                    model: transcripts_model_1.default,
                                    as: "transcripts",
                                    where: { class_id: classId }, // only get the grade for this class
                                    required: false, // allows students with no grade yet
                                    attributes: ["grade", "transcript_id"],
                                },
                            ],
                        },
                        /*{
                          model: Class,
                          as: "class",
                        },*/
                    ],
                });
                // Return plain objects
                return registrations.map((reg) => {
                    var _a, _b, _c;
                    let plain = reg.toJSON();
                    const grade = (_c = (_b = (_a = plain.student.transcripts) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.grade) !== null && _c !== void 0 ? _c : null; // Access the first grade
                    return Object.assign(Object.assign({}, plain), { student: Object.assign(Object.assign({}, plain.student), { grade: grade }) });
                });
            }
            catch (error) {
                logger_1.logger.error(`Error fetching registrations by class ID ${classId}: ${error.message}`);
                throw new Error(`Error fetching registrations by class ID: ${error.message}`);
            }
        });
    },
};
exports.default = classRegistationService;
//# sourceMappingURL=class_registation.service.js.map