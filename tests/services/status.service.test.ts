import statusService from "../../src/services/status.service";
import Status from "../../src/models/status.model";
import { logger } from "../../src/config/logger";

jest.mock("../../src/models/status.model");
jest.mock("../../src/config/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("statusService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllStatuses", () => {
    it("should return all statuses in ascending order", async () => {
      const mockStatuses = [
        {
          status_id: 1,
          name: "Pending",
          dataValues: { status_id: 1, name: "Pending" },
        },
        {
          status_id: 2,
          name: "Approved",
          dataValues: { status_id: 2, name: "Approved" },
        },
      ];

      (Status.findAll as jest.Mock).mockResolvedValue(mockStatuses);

      const result = await statusService.getAllStatuses();

      expect(Status.findAll).toHaveBeenCalledWith({
        order: [["status_id", "ASC"]],
      });
      expect(logger.info).toHaveBeenCalledWith(
        "Fetched status list successfully"
      );
      expect(result).toEqual([
        { status_id: 1, name: "Pending" },
        { status_id: 2, name: "Approved" },
      ]);
    });

    it("should handle errors when fetching statuses", async () => {
      (Status.findAll as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await expect(statusService.getAllStatuses()).rejects.toThrow(
        "Error fetching status list"
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Error fetching status list: Database error"
      );
    });
  });

  describe("getStatus", () => {
    it("should return all statuses", async () => {
      const mockStatuses = [{ status_id: 1, name: "Pending" }];

      (Status.findAll as jest.Mock).mockResolvedValue(mockStatuses);

      const result = await statusService.getStatus();

      expect(Status.findAll).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        "Fetched status list successfully"
      );
      expect(result).toEqual(mockStatuses);
    });

    it("should handle errors", async () => {
      (Status.findAll as jest.Mock).mockRejectedValue(new Error("DB error"));

      await expect(statusService.getStatus()).rejects.toThrow(
        "Error fetching status list"
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Error fetching status list: DB error"
      );
    });
  });

  describe("addStatus", () => {
    it("should add a new status and return it", async () => {
      const name = "In Progress";
      const createdStatus = {
        toJSON: () => ({ status_id: 3, name }),
      };

      (Status.create as jest.Mock).mockResolvedValue(createdStatus);

      const result = await statusService.addStatus(name);

      expect(Status.create).toHaveBeenCalledWith({ name });
      expect(logger.info).toHaveBeenCalledWith("Added new status successfully");
      expect(result).toEqual({ status_id: 3, name });
    });

    it("should handle errors when adding status", async () => {
      (Status.create as jest.Mock).mockRejectedValue(new Error("Create error"));

      await expect(statusService.addStatus("Test")).rejects.toThrow(
        "Error adding new status: Create error"
      );
      expect(logger.error).toHaveBeenCalledWith(
        "Error adding new status: Create error"
      );
    });
  });

  describe("updateStatus", () => {
    it("should update status and return updated data", async () => {
      const statusId = 1;
      const statusData = { name: "Updated Name" };
      const updatedStatus = {
        get: () => ({ status_id: 1, name: "Updated Name" }),
      };

      (Status.update as jest.Mock).mockResolvedValue([1]);
      (Status.findOne as jest.Mock).mockResolvedValue(updatedStatus);

      const result = await statusService.updateStatus(statusId, statusData);

      expect(Status.update).toHaveBeenCalledWith(statusData, {
        where: { status_id: statusId },
      });
      expect(Status.findOne).toHaveBeenCalledWith({
        where: { status_id: statusId },
      });
      expect(logger.info).toHaveBeenCalledWith(
        "Updated status with id 1 successfully"
      );
      expect(result).toEqual({ status_id: 1, name: "Updated Name" });
    });

    it("should throw an error if status not found", async () => {
      (Status.update as jest.Mock).mockResolvedValue([0]);

      await expect(
        statusService.updateStatus(1, { name: "X" })
      ).rejects.toThrow("Status not found");
      expect(logger.error).toHaveBeenCalledWith("Status with id 1 not found");
    });

    it("should handle errors", async () => {
      (Status.update as jest.Mock).mockRejectedValue(new Error("Update error"));

      await expect(
        statusService.updateStatus(1, { name: "Fail" })
      ).rejects.toThrow("Update error");
      expect(logger.error).toHaveBeenCalledWith(
        "Error updating status with id 1: Update error"
      );
    });
  });
});
