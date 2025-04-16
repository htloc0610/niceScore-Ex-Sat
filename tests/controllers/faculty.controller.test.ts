import { Request, Response } from "express";
import facultyController from "../../src/controllers/faculty.controller";
import facultyService from "../../src/services/faculty.service";
import { logger } from "../../src/config/logger";

// Mock service và logger
jest.mock("../../src/services/faculty.service");
jest.mock("../../src/config/logger");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe("facultyController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getListFaculties", () => {
    it("should return list of faculties on success", async () => {
      const mockFaculties = [
        { id: 1, name: "Engineering" },
        { id: 2, name: "Science" },
      ];
      (facultyService.getFaculties as jest.Mock).mockResolvedValue(
        mockFaculties
      );

      const req = {} as Request;
      const res = mockResponse();

      await facultyController.getListFaculties(req, res);

      expect(facultyService.getFaculties).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        "Successfully fetched faculties list"
      );
      expect(res.send).toHaveBeenCalledWith({
        message: "List of faculties",
        faculties: mockFaculties,
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      (facultyService.getFaculties as jest.Mock).mockRejectedValue(error);

      const req = {} as Request;
      const res = mockResponse();

      await facultyController.getListFaculties(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        "Error fetching faculties list"
      );
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching faculties.",
      });
    });
  });

  describe("addFaculty", () => {
    it("should add faculty successfully", async () => {
      const newFacultyData = { name: "Business" };
      const mockNewFaculty = { id: 3, ...newFacultyData };
      (facultyService.addFaculty as jest.Mock).mockResolvedValue(
        mockNewFaculty
      );

      const req = { body: newFacultyData } as Request;
      const res = mockResponse();

      await facultyController.addFaculty(req, res);

      expect(facultyService.addFaculty).toHaveBeenCalledWith("Business");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: "Faculty added successfully",
        newFaculty: mockNewFaculty,
      });
    });

    it("should handle errors when adding faculty", async () => {
      const error = new Error("Error adding faculty");
      (facultyService.addFaculty as jest.Mock).mockRejectedValue(error);

      const req = { body: { name: "Business" } } as Request;
      const res = mockResponse();

      await facultyController.addFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while adding the faculty.",
      });
    });
  });

  describe("updateFaculty", () => {
    it("should update faculty successfully", async () => {
      const updatedFacultyData = { faculty_id: 1, name: "Updated Engineering" };
      const mockUpdatedFaculty = { id: 1, ...updatedFacultyData };
      (facultyService.updateFaculty as jest.Mock).mockResolvedValue(
        mockUpdatedFaculty
      );

      const req = { body: updatedFacultyData } as Request;
      const res = mockResponse();

      await facultyController.updateFaculty(req, res);

      expect(facultyService.updateFaculty).toHaveBeenCalledWith(
        1,
        updatedFacultyData
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Faculty updated successfully",
        updatedFaculty: mockUpdatedFaculty,
      });
    });

    it("should return 404 if faculty not found", async () => {
      const updatedFacultyData = {
        faculty_id: 99,
        name: "Nonexistent Faculty",
      };
      (facultyService.updateFaculty as jest.Mock).mockResolvedValue(null);

      const req = { body: updatedFacultyData } as Request;
      const res = mockResponse();

      await facultyController.updateFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Faculty not found or no changes made.",
      });
    });

    it("should handle errors when updating faculty", async () => {
      const error = new Error("Error updating faculty");
      (facultyService.updateFaculty as jest.Mock).mockRejectedValue(error);

      const req = {
        body: { faculty_id: 1, name: "Updated Engineering" },
      } as Request;
      const res = mockResponse();

      await facultyController.updateFaculty(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while updating the faculty.",
      });
    });
  });
});
