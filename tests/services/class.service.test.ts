// tests/services/class.service.test.ts
import classService from "../../src/services/class.service";
import Class from "../../src/models/classes.model";
import Module from "../../src/models/modules.model";

jest.mock("../../src/models/classes.model");
jest.mock("../../src/models/modules.model");

describe("classService", () => {
  describe("getAllClasses", () => {
    it("should return all classes", async () => {
      const mockClasses = [
        {
          dataValues: {
            class_id: 1,
            class_name: "Math 101",
            instructor: "Mr. A",
            schedule: "Mon-Wed",
          },
        },
      ];

      (Class.findAll as jest.Mock).mockResolvedValue(mockClasses);

      const result = await classService.getAllClasses();

      expect(Class.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockClasses[0].dataValues]);
    });

    it("should handle errors", async () => {
      (Class.findAll as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(classService.getAllClasses()).rejects.toThrow(
        "Error fetching all classes"
      );
    });
  });

  describe("isActive", () => {
    it("should return true if module is active", async () => {
      (Module.findOne as jest.Mock).mockResolvedValue({ is_active: true });

      const result = await classService.isActive(1);

      expect(result).toBe(true);
    });

    it("should return false if module is not active", async () => {
      (Module.findOne as jest.Mock).mockResolvedValue(null);

      const result = await classService.isActive(1);

      expect(result).toBe(false);
    });

    it("should handle errors", async () => {
      (Module.findOne as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(classService.isActive(1)).rejects.toThrow(
        "Error checking if class is active"
      );
    });
  });

  describe("deleteClass", () => {
    it("should delete a class", async () => {
      (Class.destroy as jest.Mock).mockResolvedValue(1);

      const result = await classService.deleteClass(1);

      expect(Class.destroy).toHaveBeenCalledWith({ where: { class_id: 1 } });
      expect(result.message).toBe("Class deleted successfully");
    });

    it("should throw an error if class not found", async () => {
      (Class.destroy as jest.Mock).mockResolvedValue(0);

      await expect(classService.deleteClass(1)).rejects.toThrow(
        "Class not found"
      );
    });

    it("should handle errors", async () => {
      (Class.destroy as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(classService.deleteClass(1)).rejects.toThrow(
        "Error deleting class"
      );
    });
  });

  describe("getClassByModuleId", () => {
    it("should return classes by module ID", async () => {
      const mockClasses = [
        {
          dataValues: {
            class_id: 1,
            class_name: "Math 101",
            instructor: "Mr. A",
            schedule: "Mon-Wed",
          },
        },
      ];

      (Class.findAll as jest.Mock).mockResolvedValue(mockClasses);

      const result = await classService.getClassByModuleId(1);

      expect(Class.findAll).toHaveBeenCalledWith({
        where: { module_id: 1 },
        order: [["class_id", "ASC"]],
      });
      expect(result).toEqual([mockClasses[0].dataValues]);
    });

    it("should handle errors", async () => {
      (Class.findAll as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(classService.getClassByModuleId(1)).rejects.toThrow(
        "Error fetching classes by module ID"
      );
    });
  });
});
