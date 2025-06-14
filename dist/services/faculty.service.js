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
const faculty_model_1 = __importDefault(require("../models/faculty.model"));
const logger_1 = require("../config/logger");
const facultyService = {
    // Get list of faculties
    getAllFaculties() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faculties = yield faculty_model_1.default.findAll({
                    order: [["faculty_id", "ASC"]],
                });
                return faculties.map(faculty => faculty.dataValues);
            }
            catch (error) {
                logger_1.logger.error("Error fetching all faculties");
                throw new Error("Error fetching all faculties");
            }
        });
    },
    // Get list of faculties
    getFaculties() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faculties = yield faculty_model_1.default.findAll();
                return faculties;
            }
            catch (error) {
                logger_1.logger.error("Error fetching faculties list");
                throw new Error("Error fetching faculties list");
            }
        });
    },
    addFaculty(nameVn, nameEn) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Adding a new faculty", { nameVn, nameEn });
            try {
                const newFaculty = yield faculty_model_1.default.create({
                    name_vn: nameVn,
                    name_en: nameEn
                });
                logger_1.logger.info("Added new faculty successfully");
                return newFaculty.toJSON();
            }
            catch (error) {
                logger_1.logger.error("Error adding new faculty: " + error.message);
                throw new Error("Error adding new faculty: " + error.message);
            }
        });
    },
    updateFaculty(facultyId, facultyData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield faculty_model_1.default.update(facultyData, {
                    where: { faculty_id: facultyId },
                });
                if (updated === 0) {
                    throw new Error("Faculty not found");
                }
                const updatedFaculty = yield faculty_model_1.default.findOne({
                    where: { faculty_id: facultyId },
                });
                return updatedFaculty ? updatedFaculty.get() : null;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    },
};
exports.default = facultyService;
//# sourceMappingURL=faculty.service.js.map