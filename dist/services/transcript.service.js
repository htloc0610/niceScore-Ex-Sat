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
const transcripts_model_1 = __importDefault(require("../models/transcripts.model"));
const logger_1 = require("../config/logger");
const transcriptService = {
    createTranscript(newTranscriptData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdtranscript = yield transcripts_model_1.default.create(newTranscriptData);
                logger_1.logger.info("Created new transcript successfully");
                return createdtranscript.toJSON();
            }
            catch (error) {
                logger_1.logger.error("Error creating new transcript: " + error.message);
                throw new Error("Error creating new transcript: " + error.message);
            }
        });
    },
    updateTranscript(transcriptId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield transcripts_model_1.default.update(updatedData, {
                    where: { transcript_id: transcriptId },
                });
                if (updated === 0) {
                    throw new Error("transcript not found");
                }
                const updatedTranscript = yield transcripts_model_1.default.findOne({
                    where: { transcript_id: transcriptId },
                });
                return updatedTranscript ? updatedTranscript.get() : null;
            }
            catch (error) {
                logger_1.logger.error("Error updating transcript: " + error.message);
                throw new Error("Error updating transcript: " + error.message);
            }
        });
    },
    getTranscriptByStudentAndClass(studentId, classId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundTranscript = yield transcripts_model_1.default.findOne({
                    where: {
                        student_id: studentId,
                        class_id: classId,
                    },
                });
                return foundTranscript ? foundTranscript.get() : null;
            }
            catch (error) {
                logger_1.logger.error(`Error fetching transcript for student ${studentId} and class ${classId}: ${error.message}`);
                throw new Error(`Error fetching transcript: ${error.message}`);
            }
        });
    },
};
exports.default = transcriptService;
//# sourceMappingURL=transcript.service.js.map