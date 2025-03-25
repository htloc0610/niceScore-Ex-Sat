import StatusTransition from "../models/status_transitions.model";
import { logger } from "../config/logger";

const statusTransitionService = {
  checkStatusTransition: async (currentStatus: string, newStatus: string) => {
    try {
      const statusTransition = await StatusTransition.findOne({
        where: { current_status: currentStatus, new_status: newStatus },
      });
      return statusTransition !== null;
    } catch (error) {
      logger.error("Error checking status transition: " + error.message);
      console.error("Error checking status transition:", error);
      throw error;
    }
  },
  getStatusTransitions: async () => {
    try {
      const statusTransitions = await StatusTransition.findAll();
      return statusTransitions;
    } catch (error) {
      logger.error("Error getting status transitions: " + error.message);
      console.error("Error getting status transitions:", error);
      throw error;
    }
  },
  addStatusTransitions: async (current_status: string, new_status: string) => {
    try {
      const existingTransition = await StatusTransition.findOne({
        where: { current_status, new_status },
      });
      if (existingTransition) {
        throw new Error("Status transition already exists");
      }
      const newStatusTransition = await StatusTransition.create({
        current_status,
        new_status,
      });
      return newStatusTransition;
    } catch (error) {
      logger.error("Error adding status transition: " + error.message);
      console.error("Error adding status transition:", error);
      throw error;
    }
  },
  updateStatusTransitions: async (
    id: number,
    current_status: string,
    new_status: string
  ) => {
    try {
      const statusTransition = await StatusTransition.findByPk(id);
      if (!statusTransition) {
        throw new Error("Status transition not found");
      }
      statusTransition.current_status = current_status;
      statusTransition.new_status = new_status;
      await statusTransition.save();
      return statusTransition;
    } catch (error) {
      logger.error("Error updating status transition: " + error.message);
      console.error("Error updating status transition:", error);
      throw error;
    }
  },
};

export default statusTransitionService;
