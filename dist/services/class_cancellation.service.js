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
const registration_cancellations_model_1 = __importDefault(require("../models/registration_cancellations.model"));
const student_model_1 = __importDefault(require("../models/student.model"));
const classes_model_1 = __importDefault(require("../models/classes.model"));
const logger_1 = require("../config/logger");
const classRegistationService = {
    getAllCancellations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const registrations = yield registration_cancellations_model_1.default.findAll({
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
                    order: [["cancellation_id", "ASC"]],
                });
                return registrations.map((reg) => reg.get({ plain: true }));
            }
            catch (error) {
                logger_1.logger.error("Error fetching all cancellations", error);
                throw new Error("Error fetching all cancellations");
            }
        });
    },
    getCancellationDetails(moduleID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cancellations = yield registration_cancellations_model_1.default.findAll({
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
                            where: { module_id: moduleID },
                        },
                    ],
                    order: [["cancellation_id", "ASC"]],
                });
                return cancellations.map((cancellation) => cancellation.get({ plain: true }));
            }
            catch (error) {
                logger_1.logger.error(`Error fetching cancellations for module ID: ${moduleID}`, error);
                throw new Error("Error fetching cancellations for the specified module ID");
            }
        });
    },
    //getCancellationsByStudentId
    getCancellationsByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cancellations = yield registration_cancellations_model_1.default.findAll({
                    include: [
                        {
                            model: student_model_1.default,
                            as: "student",
                            attributes: ["student_id", "full_name", "email"],
                            where: { student_id: studentId },
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
                    order: [["cancellation_id", "ASC"]],
                });
                return cancellations.map((cancellation) => cancellation.get({ plain: true }));
            }
            catch (error) {
                logger_1.logger.error(`Error fetching cancellations for student ID: ${studentId}`, error);
                throw new Error("Error fetching cancellations for the specified student ID");
            }
        });
    },
};
exports.default = classRegistationService;
//# sourceMappingURL=class_cancellation.service.js.map