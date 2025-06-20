import { Request, Response } from "express";
import statusService from "../services/status.service";
import { logger } from "../config/logger";

const statusController = {
  getListStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const status = await statusService.getStatus();
      logger.info("Fetched list of status successfully");
      res.send({ message: "List of status", status });
    } catch (error) {
      logger.error("An error occurred while fetching status", error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching status." });
    }
  }, 
  getStatusById: async (req: Request, res: Response): Promise<void> => {
    try {
      const statusId = parseInt(req.params.id, 10);
      const status = await statusService.getStatusById(statusId);
      if (!status) {
        logger.warn(`Status with ID ${statusId} not found`);
        res.status(404).send({ message: "Status not found" });
        return;
      }
      res.send({ message: "Status found", status });
    } catch (error) {
      logger.error("An error occurred while fetching status by ID", error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the status." });
    }
  },
  addStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      console.log(data, "data: ");
      const newStatus = await statusService.addStatus(data.name_vi, data.name_en);
      logger.info("Status added successfully");
      res.status(201).send({ message: "Status added successfully", newStatus });
    } catch (error) {
      logger.error("An error occurred while adding the status", error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the status." });
    }
  },  updateStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status_id, name_vi, name_en } = req.body;
      const updatedData = req.body;
      const updatedStatus = await statusService.updateStatus(
        status_id,
        updatedData
      );

      if (!updatedStatus) {
        logger.error("Status not found or no changes made", {
          status_id,
          name_vi,
          name_en
        });
        res
          .status(404)
          .send({ message: "Status not found or no changes made." });
      } else {
        logger.info("Status updated successfully", { status_id, name_vi, name_en });
        res.status(200).send({
          message: "Status updated successfully",
          updatedStatus,
        });
      }
    } catch (error) {
      logger.error("An error occurred while updating the status", error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the status." });
    }
  },
};

export default statusController;
