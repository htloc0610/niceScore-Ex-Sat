// tests/services/faculty.service.test.ts
import facultyService from "../../src/services/faculty.service";
import Faculty from "../../src/models/faculty.model";

jest.mock("../../src/models/faculty.model");
jest.mock("../../src/config/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe("facultyService", () => {
  describe("getAllFaculties", () => {
    it("should return a list of all faculties", async () => {
      const mockFaculties = [
        {
          dataValues: {
            faculty_id: 1,
            name: "Faculty of Science",
          },
        },
        {
          dataValues: {
            faculty_id: 2,
            name: "Faculty of Engineering",
          },
        },
      ];

      (Faculty.findAll as jest.Mock).mockResolvedValue(mockFaculties);

      const result = await facultyService.getAllFaculties();

      expect(Faculty.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        mockFaculties[0].dataValues,
        mockFaculties[1].dataValues,
      ]);
    });

    it("should handle errors", async () => {
      (Faculty.findAll as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(facultyService.getAllFaculties()).rejects.toThrow(
        "Error fetching all faculties"
      );
    });
  });

  describe("getFaculties", () => {
    it("should return all faculties", async () => {
      const mockFaculties = [
        { faculty_id: 1, name: "Faculty of Science" },
        { faculty_id: 2, name: "Faculty of Engineering" },
      ];

      (Faculty.findAll as jest.Mock).mockResolvedValue(mockFaculties);

      const result = await facultyService.getFaculties();

      expect(Faculty.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockFaculties);
    });

    it("should handle errors", async () => {
      (Faculty.findAll as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(facultyService.getFaculties()).rejects.toThrow(
        "Error fetching faculties list"
      );
    });
  });

  describe("updateFaculty", () => {
    it("should update an existing faculty", async () => {
      const facultyId = 1;
      const facultyData = { name: "Faculty of Business" };
      const mockUpdatedFaculty = {
        faculty_id: facultyId,
        name: "Faculty of Business",
      };

      (Faculty.update as jest.Mock).mockResolvedValue([1]); // 1 row affected
      (Faculty.findOne as jest.Mock).mockResolvedValue({
        get: jest.fn(() => mockUpdatedFaculty),
      });

      const result = await facultyService.updateFaculty(facultyId, facultyData);

      expect(Faculty.update).toHaveBeenCalledWith(facultyData, {
        where: { faculty_id: facultyId },
      });
      expect(result).toEqual(mockUpdatedFaculty);
    });

    it("should return null if faculty not found", async () => {
      const facultyId = 1;
      const facultyData = { name: "Faculty of Business" };

      (Faculty.update as jest.Mock).mockResolvedValue([0]); // No rows affected

      await expect(
        facultyService.updateFaculty(facultyId, facultyData)
      ).rejects.toThrow("Faculty not found");
    });

    it("should handle errors", async () => {
      const facultyId = 1;
      const facultyData = { name: "Faculty of Business" };

      (Faculty.update as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(
        facultyService.updateFaculty(facultyId, facultyData)
      ).rejects.toThrow("Test error");
    });
  });
});
