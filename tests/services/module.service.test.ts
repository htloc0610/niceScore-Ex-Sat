import moduleService from "../../src/services/module.service";
import Modules from "../../src/models/modules.model";
import Faculty from "../../src/models/faculty.model";
import Class from "../../src/models/classes.model";
import ClassRegistration from "../../src/models/class_registrations.model";
import { logger } from "../../src/config/logger";

jest.mock("../../src/models/modules.model");
jest.mock("../../src/models/faculty.model");
jest.mock("../../src/models/classes.model");
jest.mock("../../src/models/class_registrations.model");
jest.mock("../../src/config/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe("moduleService", () => {
  describe("getModuleById", () => {
    it("should return a module by id", async () => {
      const mockModule = {
        module_id: 1,
        module_code: "CS101",
        name: "CS Basics",
      };

      (Modules.findOne as jest.Mock).mockResolvedValue({
        dataValues: mockModule,
      });

      const result = await moduleService.getModuleById(1);

      expect(Modules.findOne).toHaveBeenCalledWith({
        where: { module_id: 1 },
      });
      expect(result).toEqual(mockModule);
    });

    it("should throw an error if module not found", async () => {
      (Modules.findOne as jest.Mock).mockResolvedValue(null);

      await expect(moduleService.getModuleById(1)).rejects.toThrow(
        "Module not found"
      );
    });

    it("should handle errors", async () => {
      (Modules.findOne as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(moduleService.getModuleById(1)).rejects.toThrow(
        "Error fetching module by ID: Test error"
      );
    });
  });

  describe("hasRegisterStudent", () => {
    it("should return true if the module has registered students", async () => {
      (Class.findOne as jest.Mock).mockResolvedValue({
        registrations: [{ student_id: 1 }],
      });

      const result = await moduleService.hasRegisterStudent(1);

      expect(result).toBe(true);
    });

    it("should return false if the module has no registered students", async () => {
      (Class.findOne as jest.Mock).mockResolvedValue(null);

      const result = await moduleService.hasRegisterStudent(1);

      expect(result).toBe(false);
    });

    it("should handle errors", async () => {
      (Class.findOne as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(moduleService.hasRegisterStudent(1)).rejects.toThrow(
        "Error checking registered students: Test error"
      );
    });
  });

  describe("deleteModule", () => {
    it("should delete a module", async () => {
      const moduleId = 1;

      (Modules.destroy as jest.Mock).mockResolvedValue(1); // 1 row affected

      const result = await moduleService.deleteModule(moduleId);

      expect(Modules.destroy).toHaveBeenCalledWith({
        where: { module_id: moduleId },
      });
      expect(result).toEqual({ message: "Module deleted successfully" });
    });

    it("should throw an error if module not found", async () => {
      const moduleId = 1;

      (Modules.destroy as jest.Mock).mockResolvedValue(0); // No rows affected

      await expect(moduleService.deleteModule(moduleId)).rejects.toThrow(
        "Module not found"
      );
    });

    it("should handle errors", async () => {
      const moduleId = 1;

      (Modules.destroy as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(moduleService.deleteModule(moduleId)).rejects.toThrow(
        "Error deleting module: Test error"
      );
    });
  });

  describe("isModuleOlderThan30Minutes", () => {
    it("should return true if module is older than 30 minutes", async () => {
      const mockModule = { createdAt: new Date(Date.now() - 31 * 60 * 1000) };

      (Modules.findOne as jest.Mock).mockResolvedValue({
        getDataValue: jest.fn().mockReturnValue(mockModule.createdAt),
      });

      const result = await moduleService.isModuleOlderThan30Minutes(1);

      expect(result).toBe(true);
    });

    it("should return false if module is not older than 30 minutes", async () => {
      const mockModule = { createdAt: new Date(Date.now() - 10 * 60 * 1000) };

      (Modules.findOne as jest.Mock).mockResolvedValue({
        getDataValue: jest.fn().mockReturnValue(mockModule.createdAt),
      });

      const result = await moduleService.isModuleOlderThan30Minutes(1);

      expect(result).toBe(false);
    });

    it("should handle errors", async () => {
      (Modules.findOne as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(moduleService.isModuleOlderThan30Minutes(1)).rejects.toThrow(
        "Error checking module age: Test error"
      );
    });
  });

  describe("hasLinkedClasses", () => {
    it("should return true if module has linked classes", async () => {
      (Class.findOne as jest.Mock).mockResolvedValue({ module_id: 1 });

      const result = await moduleService.hasLinkedClasses(1);

      expect(result).toBe(true);
    });

    it("should return false if module has no linked classes", async () => {
      (Class.findOne as jest.Mock).mockResolvedValue(null);

      const result = await moduleService.hasLinkedClasses(1);

      expect(result).toBe(false);
    });

    it("should handle errors", async () => {
      (Class.findOne as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(moduleService.hasLinkedClasses(1)).rejects.toThrow(
        "Error checking linked classes: Test error"
      );
    });
  });
});
