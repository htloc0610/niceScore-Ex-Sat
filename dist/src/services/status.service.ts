import Status from "../models/status.model";
import { logger } from "../config/logger";

const statusService = {
  async getAllStatuses() {
    try {
      const statuses = await Status.findAll({
        order: [["status_id", "ASC"]], 
      });
      logger.info("Fetched status list successfully");
      return statuses.map(status => status.dataValues);
    } catch (error) {
      logger.error("Error fetching status list: " + error.message);
      throw new Error("Error fetching status list");
    }
  },
  // Get list of status
  async getStatus() {
    try {
      const status = await Status.findAll();
      logger.info("Fetched status list successfully");
      return status;
    } catch (error) {
      logger.error("Error fetching status list: " + error.message);
      throw new Error("Error fetching status list");
    }
  },
  async addStatus(name: string) {
    console.log("Adding a new status", name);
    try {
        const newStatus = await Status.create({ name });
        logger.info("Added new status successfully");
        return newStatus.toJSON();
    } catch (error) {
        logger.error("Error adding new status: " + error.message);
        throw new Error("Error adding new status: " + error.message);
    }
  },
  async updateStatus(statusId: number, statusData: any) {
    try {
      const [updated] = await Status.update(statusData, {
        where: { status_id: statusId },
      });

      if (updated === 0) {
        logger.error(`Status with id ${statusId} not found`);
        throw new Error("Status not found");
      }
      const updatedStatus = await Status.findOne({
        where: { status_id: statusId },
      });
      logger.info(`Updated status with id ${statusId} successfully`);
      return updatedStatus ? updatedStatus.get() : null;
    } catch (error) {
      logger.error(
        `Error updating status with id ${statusId}: ${error.message}`
      );
      throw new Error(error.message);
    }
  },
};

export default statusService;
