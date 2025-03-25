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
    addFaculty: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = req.body;
            const newFaculty = yield faculty_service_1.default.addFaculty(data);
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
    }),
    updateFaculty: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { faculty_id, name } = req.body;
            const updatedData = req.body;
            console.log(updatedData, "id", faculty_id);
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