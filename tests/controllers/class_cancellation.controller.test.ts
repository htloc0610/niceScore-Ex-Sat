import classRegistationController from "../../src/controllers/class_cancellation.controller";
import classCancellationService from "../../src/services/class_cancellation.service";
import { logger } from "../../src/config/logger";
import { Request, Response } from "express";

jest.mock("../../src/services/class_cancellation.service");
jest.mock("../../src/config/logger");

describe("classRegistationController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { params: {} };
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("getClassCancellationList", () => {
    it("should return list of class cancellations", async () => {
      const mockCancellations = [{ id: 1 }, { id: 2 }];
      (classCancellationService.getAllCancellations as jest.Mock).mockResolvedValue(mockCancellations);

      await classRegistationController.getClassCancellationList(
        req as Request,
        res as Response
      );

      expect(classCancellationService.getAllCancellations).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith("Successfully fetched class cancellation list");
      expect(res.send).toHaveBeenCalledWith({
        message: "List of class cancellations",
        cancellations: mockCancellations,
      });
    });

    it("should handle errors", async () => {
      (classCancellationService.getAllCancellations as jest.Mock).mockRejectedValue(new Error("fail"));

      await classRegistationController.getClassCancellationList(
        req as Request,
        res as Response
      );

      expect(logger.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching class cancellations.",
      });
    });
  });

  describe("getClassCancellationDetails", () => {
    it("should return cancellation details if found", async () => {
      req.params = { moduleID: "M123" };
      const mockDetails = { id: "M123", reason: "Holiday" };
      (classCancellationService.getCancellationDetails as jest.Mock).mockResolvedValue(mockDetails);

      await classRegistationController.getClassCancellationDetails(
        req as Request,
        res as Response
      );

      expect(classCancellationService.getCancellationDetails).toHaveBeenCalledWith("M123");
      expect(logger.info).toHaveBeenCalledWith(
        "Successfully fetched cancellation details for moduleID: M123"
      );
      expect(res.send).toHaveBeenCalledWith({
        message: "Cancellation details for moduleID: M123",
        cancellationDetails: mockDetails,
      });
    });

    it("should return 404 if details not found", async () => {
      req.params = { moduleID: "M404" };
      (classCancellationService.getCancellationDetails as jest.Mock).mockResolvedValue(null);

      await classRegistationController.getClassCancellationDetails(
        req as Request,
        res as Response
      );

      expect(logger.warn).toHaveBeenCalledWith(
        "No cancellation details found for moduleID: M404"
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "No cancellation details found for moduleID: M404",
      });
    });

    it("should handle errors", async () => {
      req.params = { moduleID: "M500" };
      (classCancellationService.getCancellationDetails as jest.Mock).mockRejectedValue(new Error("fail"));

      await classRegistationController.getClassCancellationDetails(
        req as Request,
        res as Response
      );

      expect(logger.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching class cancellation details.",
      });
    });
  });

  describe("getRegistrationCancellationsByStudentId", () => {
    it("should return cancellations for student", async () => {
      req.params = { studentId: "123" };
      const mockCancellations = [{ id: 1 }];
      (classCancellationService.getCancellationsByStudentId as jest.Mock).mockResolvedValue(mockCancellations);

      await classRegistationController.getRegistrationCancellationsByStudentId(
        req as Request,
        res as Response
      );

      expect(classCancellationService.getCancellationsByStudentId).toHaveBeenCalledWith(123);
      expect(logger.info).toHaveBeenCalledWith(
        "Successfully fetched cancellation details for studentId: 123"
      );
      expect(res.send).toHaveBeenCalledWith({
        message: "Cancellation details for studentId: 123",
        cancellations: mockCancellations,
      });
    });

    it("should return 404 if no cancellations found", async () => {
      req.params = { studentId: "999" };
      (classCancellationService.getCancellationsByStudentId as jest.Mock).mockResolvedValue(null);

      await classRegistationController.getRegistrationCancellationsByStudentId(
        req as Request,
        res as Response
      );

      expect(logger.warn).toHaveBeenCalledWith(
        "No cancellation details found for studentId: 999"
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "No cancellation details found for studentId: 999",
      });
    });

    it("should handle errors", async () => {
      req.params = { studentId: "500" };
      (classCancellationService.getCancellationsByStudentId as jest.Mock).mockRejectedValue(new Error("fail"));

      await classRegistationController.getRegistrationCancellationsByStudentId(
        req as Request,
        res as Response
      );

      expect(logger.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching class cancellation details by student ID.",
      });
    });
  });
});