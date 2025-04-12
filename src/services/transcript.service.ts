import transcript from "../models/transcripts.model";
import { logger } from "../config/logger";

const transcriptService = {
  async createTranscript(newTranscriptData: any) {
    try {
      const createdtranscript = await transcript.create(newTranscriptData);
      logger.info("Created new transcript successfully");
      return createdtranscript.toJSON();
    } catch (error) {
      logger.error("Error creating new transcript: " + error.message);
      throw new Error("Error creating new transcript: " + error.message);
    }
  },

  async updateTranscript(transcriptId: number, updatedData: any) {
    try {
      const [updated] = await transcript.update(updatedData, {
        where: { transcript_id: transcriptId },
      });

      if (updated === 0) {
        throw new Error("transcript not found");
      }
      const updatedTranscript = await transcript.findOne({
        where: { transcript_id: transcriptId },
      });
      return updatedTranscript ? updatedTranscript.get() : null;
    } catch (error) {
      logger.error("Error updating transcript: " + error.message);
      throw new Error("Error updating transcript: " + error.message);
    }
  },
};

export default transcriptService;
