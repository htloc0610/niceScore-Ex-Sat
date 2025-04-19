import { Request, Response } from "express";
import statusTransitionService from "../services/status_transitions.service";
import { logger } from "../config/logger";

const statusTransitionController = {
  checkStatusTransition: async (req: Request, res: Response) => {
    const { currentStatus, newStatus } = req.body;
    logger.info(
      `Checking status transition from ${currentStatus} to ${newStatus}`
    );
    try {
      const isValid = await statusTransitionService.checkStatusTransition(
        currentStatus,
        newStatus
      );
      res.status(200).json({ isValid });
    } catch (error) {
      logger.error(`Error checking status transition: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },
  getStatusTransitions: async (req: Request, res: Response) => {
    logger.info(`Getting status transitions`);
    try {
      const transitions = await statusTransitionService.getStatusTransitions();
      res.status(200).json(transitions);
    } catch (error) {
      logger.error(`Error getting status transitions: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },
  getValidNextStatusById: async (req: Request, res: Response) => {
    logger.info(`Getting valid next status by id`);
    try {
      const { id } = req.params;
      const statusId = parseInt(id, 10);
      const status = await statusTransitionService.getValidNextStatusById(statusId);
      res.status(200).json(status);
    } catch (error) {
      logger.error(`Error getting status transitions: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },
  addStatusTransitions: async (req: Request, res: Response) => {
    const { current_status, new_status } = req.body;
    try {
      const result = await statusTransitionService.addStatusTransitions(
        current_status,
        new_status
      );
      logger.info(`Adding new status transitions`);
      res.status(201).json(result);
    } catch (error) {
      logger.error(`Error adding status transitions: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },
  updateStatusTransitions: async (req: Request, res: Response) => {
    const { id, current_status, new_status } = req.body;
    try {
    
      const result = await statusTransitionService.updateStatusTransitions(
        id,
        current_status,
        new_status
      );
      
      logger.info(`Updating status transition with id ${id}`);
      res.status(200).json(result);
    } catch (error) {
      logger.error(`Error updating status transitions: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  },
  deleteStatusTransitions: async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const result = await statusTransitionService.deleteStatusTransitions(parseInt(id, 10));
      if (!result) {
      res.status(404).json({ error: "Status transition not found" });
      return;
      }
      logger.info(`Deleted status transition with id ${id}`);
      res.status(200).json({ message: "Status transition deleted successfully" });
    } catch (error) {
      logger.error(`Error deleting status transition: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
    }
};

export default statusTransitionController;
