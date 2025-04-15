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
  getClassCancellationDetails: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { moduleID } = req.params;
      const cancellationDetails =
        await classCancellationService.getCancellationDetails(moduleID);
      if (!cancellationDetails) {
        logger.warn(`No cancellation details found for moduleID: ${moduleID}`);
        res.status(404).send({
          message: `No cancellation details found for moduleID: ${moduleID}`,
        });
        return;
      }
      logger.info(
        `Successfully fetched cancellation details for moduleID: ${moduleID}`
      );
      res.send({
        message: `Cancellation details for moduleID: ${moduleID}`,
        cancellationDetails,
      });
    } catch (error) {
      logger.error("Error fetching class cancellation details", { error });
      res.status(500).send({
        message: "An error occurred while fetching class cancellation details.",
      });
    }
  },
};

export default classRegistationController;
