import StatusTransition from "../models/status_transitions.model";
import { logger } from "../config/logger";

const configurationService = {
  checkStatusTransition: async (currentStatus: string, newStatus: string) => {
    try {
      const statusTransition = await StatusTransition.findOne({
        where: { current_status: currentStatus, new_status: newStatus }
      });
      return statusTransition !== null;
    } catch (error) {
      logger.error("Error checking status transition: " + error.message);
      console.error("Error checking status transition:", error);
      throw error;
    };
  },
  getStatusTransitions: async (currentStatus: string) => {
    try {
      const statusTransitions = await StatusTransition.findAll({
        where: { current_status: currentStatus }
      });
      return statusTransitions;
    } catch (error) {
      logger.error("Error getting status transitions: " + error.message);
      console.error("Error getting status transitions:", error);
      throw error;
    };
  }
};

export default configurationService;
