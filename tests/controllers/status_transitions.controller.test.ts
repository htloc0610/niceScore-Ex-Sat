import statusTransitionController from "../../src/controllers/status_transitions.controller";
import statusTransitionService from "../../src/services/status_transitions.service";
import { logger } from "../../src/config/logger";
import { Request, Response } from "express";

jest.mock("../../src/services/status_transitions.service");
jest.mock("../../src/config/logger");

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

describe("statusTransitionController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("checkStatusTransition", () => {
    it("should return 200 and isValid true", async () => {
      (statusTransitionService.checkStatusTransition as jest.Mock).mockResolvedValue(true);
      const req = { body: { currentStatus: "A", newStatus: "B" } } as Request;
      const res = mockResponse();

      await statusTransitionController.checkStatusTransition(req, res);

      expect(statusTransitionService.checkStatusTransition).toHaveBeenCalledWith("A", "B");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ isValid: true });
    });

    it("should handle errors and return 500", async () => {
      (statusTransitionService.checkStatusTransition as jest.Mock).mockRejectedValue(new Error("fail"));
      const req = { body: { currentStatus: "A", newStatus: "B" } } as Request;
      const res = mockResponse();

      await statusTransitionController.checkStatusTransition(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("getStatusTransitions", () => {
    it("should return 200 and transitions", async () => {
      (statusTransitionService.getStatusTransitions as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const req = {} as Request;
      const res = mockResponse();

      await statusTransitionController.getStatusTransitions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it("should handle errors and return 500", async () => {
      (statusTransitionService.getStatusTransitions as jest.Mock).mockRejectedValue(new Error("fail"));
      const req = {} as Request;
      const res = mockResponse();

      await statusTransitionController.getStatusTransitions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("getValidNextStatusById", () => {
    it("should return 200 and status", async () => {
      (statusTransitionService.getValidNextStatusById as jest.Mock).mockResolvedValue({ id: 2 });
      const req = { params: { id: "2" } } as unknown as Request;
      const res = mockResponse();

      await statusTransitionController.getValidNextStatusById(req, res);

      expect(statusTransitionService.getValidNextStatusById).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 2 });
    });

    it("should handle errors and return 500", async () => {
      (statusTransitionService.getValidNextStatusById as jest.Mock).mockRejectedValue(new Error("fail"));
      const req = { params: { id: "2" } } as unknown as Request;
      const res = mockResponse();

      await statusTransitionController.getValidNextStatusById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("addStatusTransitions", () => {
    it("should return 201 and result", async () => {
      (statusTransitionService.addStatusTransitions as jest.Mock).mockResolvedValue({ id: 3 });
      const req = { body: { current_status: "A", new_status: "B" } } as Request;
      const res = mockResponse();

      await statusTransitionController.addStatusTransitions(req, res);

      expect(statusTransitionService.addStatusTransitions).toHaveBeenCalledWith("A", "B");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 3 });
    });

    it("should handle errors and return 500", async () => {
      (statusTransitionService.addStatusTransitions as jest.Mock).mockRejectedValue(new Error("fail"));
      const req = { body: { current_status: "A", new_status: "B" } } as Request;
      const res = mockResponse();

      await statusTransitionController.addStatusTransitions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("updateStatusTransitions", () => {
    it("should return 200 and result", async () => {
      (statusTransitionService.updateStatusTransitions as jest.Mock).mockResolvedValue({ id: 4 });
      const req = { body: { id: 4, current_status: "A", new_status: "C" } } as Request;
      const res = mockResponse();

      await statusTransitionController.updateStatusTransitions(req, res);

      expect(statusTransitionService.updateStatusTransitions).toHaveBeenCalledWith(4, "A", "C");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 4 });
    });

    it("should handle errors and return 500", async () => {
      (statusTransitionService.updateStatusTransitions as jest.Mock).mockRejectedValue(new Error("fail"));
      const req = { body: { id: 4, current_status: "A", new_status: "C" } } as Request;
      const res = mockResponse();

      await statusTransitionController.updateStatusTransitions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });

  describe("deleteStatusTransitions", () => {
    it("should return 200 if deleted", async () => {
      (statusTransitionService.deleteStatusTransitions as jest.Mock).mockResolvedValue(true);
      const req = { params: { id: "5" } } as unknown as Request;
      const res = mockResponse();

      await statusTransitionController.deleteStatusTransitions(req, res);

      expect(statusTransitionService.deleteStatusTransitions).toHaveBeenCalledWith(5);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Status transition deleted successfully" });
    });

    it("should return 404 if not found", async () => {
      (statusTransitionService.deleteStatusTransitions as jest.Mock).mockResolvedValue(false);
      const req = { params: { id: "5" } } as unknown as Request;
      const res = mockResponse();

      await statusTransitionController.deleteStatusTransitions(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Status transition not found" });
    });

    it("should handle errors and return 500", async () => {
      (statusTransitionService.deleteStatusTransitions as jest.Mock).mockRejectedValue(new Error("fail"));
      const req = { params: { id: "5" } } as unknown as Request;
      const res = mockResponse();

      await statusTransitionController.deleteStatusTransitions(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "fail" });
    });
  });
});
