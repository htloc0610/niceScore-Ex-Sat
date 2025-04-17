import { Request, Response } from "express";
import moduleController from "../../src/controllers/module.controller";
import moduleService from "../../src/services/module.service";
import { logger } from "../../src/config/logger";

// Mock service và logger
jest.mock("../../src/services/module.service");
jest.mock("../../src/config/logger");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe("moduleController - Module operations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getListModules", () => {
    it("should return list of modules on success", async () => {
      const mockModules = [
        { id: 1, name: "Mathematics", credits: 3 },
        { id: 2, name: "Physics", credits: 4 },
      ];
      (moduleService.getAllModules as jest.Mock).mockResolvedValue(mockModules);

      const req = {} as Request;
      const res = mockResponse();

      await moduleController.getListModules(req, res);

      expect(moduleService.getAllModules).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        "Successfully fetched modules list"
      );
      expect(res.send).toHaveBeenCalledWith({
        message: "List of modules",
        modules: mockModules,
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      (moduleService.getAllModules as jest.Mock).mockRejectedValue(error);

      const req = {} as Request;
      const res = mockResponse();

      await moduleController.getListModules(req, res);

      expect(logger.error).toHaveBeenCalledWith("Error fetching modules list");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching modules.",
      });
    });
  });

  describe("addModule", () => {
    it("should add module successfully", async () => {
      const newModuleData = { name: "Chemistry", credits: 3 };
      const mockNewModule = { id: 3, ...newModuleData };
      (moduleService.addModule as jest.Mock).mockResolvedValue(mockNewModule);

      const req = { body: newModuleData } as Request;
      const res = mockResponse();

      await moduleController.addModule(req, res);

      expect(moduleService.addModule).toHaveBeenCalledWith(newModuleData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: "Module added successfully",
        newModule: mockNewModule,
      });
    });

    it("should return 400 if credits are less than 2", async () => {
      const newModuleData = { name: "Chemistry", credits: 1 };
      const req = { body: newModuleData } as Request;
      const res = mockResponse();

      await moduleController.addModule(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Credits must be at least 2.",
      });
    });

    it("should handle errors when adding module", async () => {
      const error = new Error("Error adding module");
      (moduleService.addModule as jest.Mock).mockRejectedValue(error);

      const req = { body: { name: "Chemistry", credits: 3 } } as Request;
      const res = mockResponse();

      await moduleController.addModule(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while adding the module.",
      });
    });
  });
});
