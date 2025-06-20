import StatusTransition from "../models/status_transitions.model";
import Status from "../models/status.model";
import { logger } from "../config/logger";

const statusTransitionService = {
  checkStatusTransition: async (currentStatus: number, newStatus: number) => {
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
  getValidNextStatusById: async (id: number) => {
    try {
        // Find all transitions where current_status = id
        const transitions = await StatusTransition.findAll({
            where: { current_status: id },
            attributes: ["id", "new_status"], // Include id and new_status
        });

        const newStatusIds = transitions.map(t => t.new_status);

        const statusIds = new Set([id, ...newStatusIds]);        const statuses = await Status.findAll({
            where: { status_id: Array.from(statusIds) },
            attributes: ["status_id", "name_vn", "name_en"]
        });

        return statuses.map(status => status.dataValues);
    } catch (error) {
        console.error("Error fetching status transitions:", error);
        throw error;
    }
},  getStatusTransitions: async () => {
    try {
      const statusTransitions = await StatusTransition.findAll({
        include: [
          {
            model: Status,
            as: "currentStatus", // Dùng alias đã định nghĩa trong belongsTo
            attributes: ["status_id", "name_vi", "name_en"], // Sửa 'id' thành 'status_id' nếu đúng theo schema
          },
          {
            model: Status,
            as: "newStatus", // Dùng alias đã định nghĩa trong belongsTo
            attributes: ["status_id", "name_vi", "name_en"], // Sửa 'id' thành 'status_id'
          },
        ],
      });
      return statusTransitions;
    } catch (error) {
      logger.error("Error getting status transitions: " + error.message);
      console.error("Error getting status transitions:", error);
      throw error;
    }
  },
  addStatusTransitions: async (current_status: number, new_status: number) => {
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
    current_status: number,
    new_status: number
  ) => {
    try {
      const statusTransition = await StatusTransition.findByPk(id);
      if (!statusTransition) {
        throw new Error("Status transition not found");
      }
      statusTransition.current_status = parseInt(current_status.toString(), 10);
      statusTransition.new_status = parseInt(new_status.toString(), 10);
      await statusTransition.save();
      return statusTransition;
    } catch (error) {
      logger.error("Error updating status transition: " + error.message);
      console.error("Error updating status transition:", error);
      throw error;
    }
  },
  deleteStatusTransitions: async (id: number) => {
    try {
      const statusTransition = await StatusTransition.findByPk(id);
      if (!statusTransition) {
        throw new Error("Status transition not found");
      }
      await statusTransition.destroy();
      return { message: "Status transition deleted successfully" };
    } catch (error) {
      logger.error("Error deleting status transition: " + error.message);
      console.error("Error deleting status transition:", error);
      throw error;
    }
  },
};

export default statusTransitionService;
