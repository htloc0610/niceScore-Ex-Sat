import statusTransitionService from "../../src/services/status_transitions.service";
import StatusTransition from "../../src/models/status_transitions.model";
import Status from "../../src/models/status.model";

jest.mock("../../src/models/status_transitions.model");
jest.mock("../../src/models/status.model");
jest.mock("../../src/config/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe("statusTransitionService", () => {
  describe("checkStatusTransition", () => {
    it("should return true if a valid status transition exists", async () => {
      (StatusTransition.findOne as jest.Mock).mockResolvedValue({});

      const result = await statusTransitionService.checkStatusTransition(1, 2);

      expect(StatusTransition.findOne).toHaveBeenCalledWith({
        where: { current_status: 1, new_status: 2 },
      });
      expect(result).toBe(true);
    });

    it("should return false if a status transition does not exist", async () => {
      (StatusTransition.findOne as jest.Mock).mockResolvedValue(null);

      const result = await statusTransitionService.checkStatusTransition(1, 2);

      expect(result).toBe(false);
    });
  });

  describe("getStatusTransitions", () => {
    it("should return all status transitions with current and new statuses", async () => {
      const mockStatusTransitions = [
        {
          currentStatus: { status_id: 1, name: "Pending" },
          newStatus: { status_id: 2, name: "In Progress" },
        },
      ];

      (StatusTransition.findAll as jest.Mock).mockResolvedValue(
        mockStatusTransitions
      );

      const result = await statusTransitionService.getStatusTransitions();

      expect(result).toEqual(mockStatusTransitions);
    });
  });

  describe("addStatusTransitions", () => {
    it("should add a new status transition", async () => {
      const currentStatus = 1;
      const newStatus = 2;
      const mockNewStatusTransition = {
        current_status: currentStatus,
        new_status: newStatus,
      };

      (StatusTransition.findOne as jest.Mock).mockResolvedValue(null);
      (StatusTransition.create as jest.Mock).mockResolvedValue(
        mockNewStatusTransition
      );

      const result = await statusTransitionService.addStatusTransitions(
        currentStatus,
        newStatus
      );

      expect(StatusTransition.create).toHaveBeenCalledWith({
        current_status: currentStatus,
        new_status: newStatus,
      });
      expect(result).toEqual(mockNewStatusTransition);
    });
  });

  describe("deleteStatusTransitions", () => {
    it("should delete a status transition", async () => {
      const id = 1;

      (StatusTransition.findByPk as jest.Mock).mockResolvedValue({
        destroy: jest.fn(),
      });

      const result = await statusTransitionService.deleteStatusTransitions(id);

      expect(StatusTransition.findByPk).toHaveBeenCalledWith(id);
      expect(result).toEqual({
        message: "Status transition deleted successfully",
      });
    });

    it("should throw an error if status transition is not found", async () => {
      const id = 1;

      (StatusTransition.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        statusTransitionService.deleteStatusTransitions(id)
      ).rejects.toThrow("Status transition not found");
    });
  });
});
