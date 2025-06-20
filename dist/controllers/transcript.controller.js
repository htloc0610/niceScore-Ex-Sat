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
const transcript_service_1 = __importDefault(require("../services/transcript.service"));
const logger_1 = require("../config/logger");
const transcriptController = {
    addTranscript: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newTranscriptData = req.body;
            if (!newTranscriptData.grade || isNaN(newTranscriptData.grade)) {
                res.status(400).send({ message: "Invalid grade value" });
            }
            // Parse and format the grade to fit DECIMAL(4, 2)
            console.log(newTranscriptData);
            newTranscriptData.grade = parseFloat(parseFloat(newTranscriptData.grade).toFixed(2));
            console.log(newTranscriptData);
            const createdtranscript = yield transcript_service_1.default.createTranscript(newTranscriptData);
            res.status(201).send({
                message: "Transcript created successfully",
                createdtranscript,
            });
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while creating the transcript." });
        }
    }),
    updateTranscript: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const transcript_id = req.params.id;
            const updatedData = req.body;
            const updatedtranscript = yield transcript_service_1.default.updateTranscript(parseInt(transcript_id), updatedData);
            if (!updatedtranscript) {
                res
                    .status(404)
                    .send({ message: "transcript not found or no changes made." });
            }
            else {
                res.status(200).send({
                    message: "transcript updated successfully",
                    updatedtranscript,
                });
            }
        }
        catch (error) {
            console.error(error);
            res
                .status(500)
                .send({ message: "An error occurred while updating the transcript." });
        }
    }),
    getTranscriptByStudentAndClass: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const studentId = parseInt(req.params.studentId, 10);
            const classId = parseInt(req.params.classId, 10);
            if (isNaN(studentId) || isNaN(classId)) {
                res.status(400).send({ message: "Invalid student ID or class ID" });
                return;
            }
            const transcript = yield transcript_service_1.default.getTranscriptByStudentAndClass(studentId, classId);
            res.status(200).send({
                message: "Transcript fetched successfully",
                transcript
            });
        }
        catch (error) {
            console.error("Error fetching transcript:", error);
            logger_1.logger.error(`Error fetching transcript: ${error.message}`);
            res.status(500).send({
                message: "An error occurred while fetching the transcript."
            });
        }
    })
};
exports.default = transcriptController;
//# sourceMappingURL=transcript.controller.js.map