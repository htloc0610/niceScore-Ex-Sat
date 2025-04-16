import { Request, Response } from "express";
import statusController from "../../src/controllers/configurations.controller";
import configurationService from "../../src/services/configurations.service";
import { logger } from "../../src/config/logger";

// Mock các dependencies
jest.mock("../../src/services/configurations.service");
jest.mock("../../src/config/logger");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe("statusController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getListConfigurations", () => {
    it("should return list of configurations on success", async () => {
      const mockConfigurations = [
        { id: 1, config_key: "key1", config_value: "value1" },
      ];
      (configurationService.getAllConfiguration as jest.Mock).mockResolvedValue(
        mockConfigurations
      );

      const req = {} as Request;
      const res = mockResponse();

      await statusController.getListConfigurations(req, res);

      expect(configurationService.getAllConfiguration).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        "Fetched list of configurations successfully"
      );
      expect(res.send).toHaveBeenCalledWith({
        message: "List of configurations",
        configurations: mockConfigurations,
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      (configurationService.getAllConfiguration as jest.Mock).mockRejectedValue(
        error
      );

      const req = {} as Request;
      const res = mockResponse();

      await statusController.getListConfigurations(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        "An error occurred while fetching configurations",
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching configurations.",
      });
    });
  });

  describe("updateConfiguration", () => {
    it("should update configuration successfully", async () => {
      const mockData = { config_key: "key1", config_value: "new_value" };
      const mockUpdatedConfig = { ...mockData, id: 1 };
      (configurationService.updateConfiguration as jest.Mock).mockResolvedValue(
        mockUpdatedConfig
      );

      const req = { body: mockData } as Request;
      const res = mockResponse();

      await statusController.updateConfiguration(req, res);

      expect(configurationService.updateConfiguration).toHaveBeenCalledWith(
        mockData
      );
      expect(logger.info).toHaveBeenCalledWith(
        "Configuration updated successfully"
      );
      expect(res.send).toHaveBeenCalledWith({
        message: "Configuration updated successfully",
        updatedConfiguration: mockUpdatedConfig,
      });
    });

    it("should return 404 if configuration is not found", async () => {
      const mockData = { config_key: "key1", config_value: "new_value" };
      (configurationService.updateConfiguration as jest.Mock).mockResolvedValue(
        null
      );

      const req = { body: mockData } as Request;
      const res = mockResponse();

      await statusController.updateConfiguration(req, res);

      expect(logger.error).toHaveBeenCalledWith("Configuration not found");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Configuration not found",
      });
    });

    it("should handle errors", async () => {
      const mockData = { config_key: "key1", config_value: "new_value" };
      const error = new Error("Unexpected error");
      (configurationService.updateConfiguration as jest.Mock).mockRejectedValue(
        error
      );

      const req = { body: mockData } as Request;
      const res = mockResponse();

      await statusController.updateConfiguration(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        "An error occurred while updating the configuration",
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while updating the configuration.",
      });
    });
  });

  describe("addConfiguration", () => {
    it("should add a new configuration successfully", async () => {
      const mockData = { config_key: "key1", config_value: "value1" };
      const mockNewConfig = { ...mockData, id: 1 };
      (configurationService.addConfiguration as jest.Mock).mockResolvedValue(
        mockNewConfig
      );

      const req = { body: mockData } as Request;
      const res = mockResponse();

      await statusController.addConfiguration(req, res);

      expect(configurationService.addConfiguration).toHaveBeenCalledWith(
        mockData
      );
      expect(logger.info).toHaveBeenCalledWith("Status added successfully");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: "Status added successfully",
        newStatus: mockNewConfig,
      });
    });

    it("should handle errors", async () => {
      const mockData = { config_key: "key1", config_value: "value1" };
      const error = new Error("Database error");
      (configurationService.addConfiguration as jest.Mock).mockRejectedValue(
        error
      );

      const req = { body: mockData } as Request;
      const res = mockResponse();

      await statusController.addConfiguration(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        "An error occurred while adding the status",
        error
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while adding the status.",
      });
    });
  });
});
