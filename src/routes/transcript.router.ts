import { Router } from "express";
import transcriptController from "../controllers/transcript.controller";

const transcriptRouter = Router();

// [POST] /api/transcript
transcriptRouter.post("/", transcriptController.addTranscript);

// [PUT] /api/transcript/:id
transcriptRouter.put("/:id", transcriptController.updateTranscript);

// [GET] /api/transcript/student/:studentId/class/:classId
transcriptRouter.get(
  "/student/:studentId/class/:classId",
  transcriptController.getTranscriptByStudentAndClass
);

export default transcriptRouter;
