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

  getRegistrationCancellationsByStudentId: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { studentId } = req.params;

      const student_number = parseInt(studentId, 10);

      const cancellations =
        await classCancellationService.getCancellationsByStudentId(student_number);
      if (!cancellations) {
        logger.warn(`No cancellation details found for studentId: ${studentId}`);
        res.status(404).send({
          message: `No cancellation details found for studentId: ${studentId}`,
        });
        return;
      }
      logger.info(
        `Successfully fetched cancellation details for studentId: ${studentId}`
      );
      res.send({
        message: `Cancellation details for studentId: ${studentId}`,
        cancellations,
      });
    } catch (error) {
      logger.error("Error fetching class cancellation details", { error });
      res.status(500).send({
        message:
          "An error occurred while fetching class cancellation details by student ID.",
      });
    }
  },
};

export default classRegistationController;
