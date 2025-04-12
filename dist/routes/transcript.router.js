"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transcript_controller_1 = __importDefault(require("../controllers/transcript.controller"));
const transcriptRouter = (0, express_1.Router)();
// [POST] /api/transcript
transcriptRouter.post("/", transcript_controller_1.default.addTranscript);
// [PUT] /api/transcript/:id
transcriptRouter.put("/:id", transcript_controller_1.default.updateTranscript);
exports.default = transcriptRouter;
//# sourceMappingURL=transcript.router.js.map