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
const faculty_service_1 = __importDefault(require("../services/faculty.service"));
const logger_1 = require("../config/logger");
const facultyController = {
    getListFaculties: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const faculties = yield faculty_service_1.default.getFaculties();
            logger_1.logger.info("Successfully fetched faculties list");
            res.send({ message: "List of faculties", faculties });
        }
        catch (error) {
            logger_1.logger.error("Error fetching faculties list");
            console.log("Error fetching faculties list:", error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching faculties." });
        }
    }),
    getFacultyById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const facultyId = parseInt(req.params.id, 10);
            const faculty = yield faculty_service_1.default.getFacultyById(facultyId);
            if (!faculty) {
                logger_1.logger.warn(`Faculty with ID ${facultyId} not found`);
                res.status(404).send({ message: "Faculty not found" });
                return;
            }
            res.send({ message: "Faculty found", faculty });
        }
        catch (error) {
            logger_1.logger.error("Error fetching faculty by ID");
            console.log("Error fetching faculty by ID:", error);
            res
                .status(500)
                .send({ message: "An error occurred while fetching the faculty." });
        }
    }),
    addFaculty: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name_vi, name_en } = req.body;
            if (!name_vi || !name_en) {
                res.status(400).send({ message: "Both Vietnamese and English names are required" });
                return;
            }
            const newFaculty = yield faculty_service_1.default.addFaculty(name_vi, name_en);
            res
                .status(201)
                .send({ message: "Faculty added successfully", newFaculty });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while adding the faculty." });
        }
    }), updateFaculty: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { faculty_id } = req.body;
            if (!faculty_id) {
                res.status(400).send({ message: "Faculty ID is required" });
                return;
            }
            const updatedData = req.body;
            const updatedFaculty = yield faculty_service_1.default.updateFaculty(faculty_id, updatedData);
            if (!updatedFaculty) {
                res
                    .status(404)
                    .send({ message: "Faculty not found or no changes made." });
            }
            else {
                res.status(200).send({
                    message: "Faculty updated successfully",
                    updatedFaculty,
                });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the faculty." });
        }
    }),
};
exports.default = facultyController;
//# sourceMappingURL=faculty.controller.js.map