import { Request, Response } from "express";
import classRegistationController from "../../src/controllers/class_cancellation.controller";
import classCancellationService from "../../src/services/class_cancellation.service";
import { logger } from "../../src/config/logger";

// Mock service và logger
jest.mock("../../src/services/class_cancellation.service");
jest.mock("../../src/config/logger");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe("classRegistationController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getClassCancellationList", () => {
    it("should return list of cancellations on success", async () => {
      const mockCancellations = [{ id: 1 }, { id: 2 }];
      (
        classCancellationService.getAllCancellations as jest.Mock
      ).mockResolvedValue(mockCancellations);

      const req = {} as Request;
      const res = mockResponse();

      await classRegistationController.getClassCancellationList(req, res);

      expect(classCancellationService.getAllCancellations).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        "Successfully fetched class cancellation list"
      );
      expect(res.send).toHaveBeenCalledWith({
        message: "List of class cancellations",
        cancellations: mockCancellations,
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      (
        classCancellationService.getAllCancellations as jest.Mock
      ).mockRejectedValue(error);

      const req = {} as Request;
      const res = mockResponse();

      await classRegistationController.getClassCancellationList(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        "Error fetching class cancellation list",
        { error }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching class cancellations.",
      });
    });
  });

  describe("getClassCancellationDetails", () => {
    it("should return cancellation details when found", async () => {
      const moduleID = "123";
      const mockDetails = { moduleID, reason: "low attendance" };
      (
        classCancellationService.getCancellationDetails as jest.Mock
      ).mockResolvedValue(mockDetails);

      const req = { params: { moduleID } } as unknown as Request;
      const res = mockResponse();

      await classRegistationController.getClassCancellationDetails(req, res);

      expect(
        classCancellationService.getCancellationDetails
      ).toHaveBeenCalledWith(moduleID);
      expect(logger.info).toHaveBeenCalledWith(
        `Successfully fetched cancellation details for moduleID: ${moduleID}`
      );
      expect(res.send).toHaveBeenCalledWith({
        message: `Cancellation details for moduleID: ${moduleID}`,
        cancellationDetails: mockDetails,
      });
    });

    it("should return 404 when no details found", async () => {
      const moduleID = "123";
      (
        classCancellationService.getCancellationDetails as jest.Mock
      ).mockResolvedValue(null);

      const req = { params: { moduleID } } as unknown as Request;
      const res = mockResponse();

      await classRegistationController.getClassCancellationDetails(req, res);

      expect(logger.warn).toHaveBeenCalledWith(
        `No cancellation details found for moduleID: ${moduleID}`
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: `No cancellation details found for moduleID: ${moduleID}`,
      });
    });

    it("should handle errors", async () => {
      const moduleID = "123";
      const error = new Error("Unexpected error");
      (
        classCancellationService.getCancellationDetails as jest.Mock
      ).mockRejectedValue(error);

      const req = { params: { moduleID } } as unknown as Request;
      const res = mockResponse();

      await classRegistationController.getClassCancellationDetails(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        "Error fetching class cancellation details",
        { error }
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching class cancellation details.",
      });
    });
  });
});
