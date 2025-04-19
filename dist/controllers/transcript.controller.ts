import { Request, Response } from "express";
import transcriptService from "../services/transcript.service";
import { logger } from "../config/logger";

const transcriptController = {
  addTranscript: async (req: Request, res: Response): Promise<void> => {
    try {
      const newTranscriptData = req.body;
      if (!newTranscriptData.grade || isNaN(newTranscriptData.grade)) {
          res.status(400).send({ message: "Invalid grade value" });
    }

    // Parse and format the grade to fit DECIMAL(4, 2)
    console.log(newTranscriptData)

    newTranscriptData.grade = parseFloat(parseFloat(newTranscriptData.grade).toFixed(2));
    console.log(newTranscriptData)
    const createdtranscript = await transcriptService.createTranscript(newTranscriptData);

      res.status(201).send({
      message: "Transcript created successfully",
      createdtranscript,
      });
    } catch (error) {
      console.error(error);
      res
      .status(500)
      .send({ message: "An error occurred while creating the transcript." });
    }
  },
  updateTranscript: async (req: Request, res: Response): Promise<void> => {
    try {
      const transcript_id = req.params.id;
      const updatedData = req.body;

      const updatedtranscript = await transcriptService.updateTranscript(parseInt(transcript_id), updatedData);
      if (!updatedtranscript) {
        res
          .status(404)
          .send({ message: "transcript not found or no changes made." });
      } else {
        res.status(200).send({
          message: "transcript updated successfully",
          updatedtranscript,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the transcript." });
    }
  }
};

export default transcriptController;
