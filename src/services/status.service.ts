import Status from "../models/status.model";
import { logger } from "../config/logger";

const statusService = {
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
  async addStatus(data: any) {
    try {
      const newStatus = await Status.create(data);
      logger.info("Added new status successfully");
      return {
        ...newStatus.toJSON(),
      };
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
  async isAvailable(new_status: string) {
    try {
      const status = await Status.findOne({
        where: { name: new_status },
      });
      return status !== null;
    } catch (error) {
      logger.error(
        `Error checking availability of status ${new_status}: ${error.message}`
      );
      throw new Error("Error checking status availability");
    }
  },
};

export default statusService;
