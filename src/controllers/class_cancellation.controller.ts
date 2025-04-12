import { Request, Response } from "express";
import classCancellationService from "../services/class_cancellation.service";
import { logger } from "../config/logger";

const classRegistationController = {
  getClassCancellationList: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const cancellations =
        await classCancellationService.getAllCancellations();
      logger.info("Successfully fetched class cancellation list");
      res.send({ message: "List of class cancellations", cancellations });
    } catch (error) {
      logger.error("Error fetching class cancellation list", { error });
      res.status(500).send({
        message: "An error occurred while fetching class cancellations.",
      });
    }
  },
};

export default classRegistationController;
