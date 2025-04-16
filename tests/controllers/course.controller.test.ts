import { Request, Response } from "express";
import courseController from "../../src/controllers/course.controller";
import courseService from "../../src/services/course.service";
import { logger } from "../../src/config/logger";

// Mock service và logger
jest.mock("../../src/services/course.service");
jest.mock("../../src/config/logger");

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res;
};

describe("courseController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getListCourse", () => {
    it("should return list of courses on success", async () => {
      const mockCourses = [
        { id: 1, name: "Math" },
        { id: 2, name: "Science" },
      ];
      (courseService.getCourses as jest.Mock).mockResolvedValue(mockCourses);

      const req = {} as Request;
      const res = mockResponse();

      await courseController.getListCourse(req, res);

      expect(courseService.getCourses).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith("Courses fetched successfully");
      expect(res.send).toHaveBeenCalledWith({
        message: "List of courses",
        courses: mockCourses,
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      (courseService.getCourses as jest.Mock).mockRejectedValue(error);

      const req = {} as Request;
      const res = mockResponse();

      await courseController.getListCourse(req, res);

      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching courses.",
      });
    });
  });

  describe("addCourse", () => {
    it("should add course successfully", async () => {
      const newCourseData = { course_name: "Physics" };
      const mockNewCourse = { id: 3, ...newCourseData };
      (courseService.addCourse as jest.Mock).mockResolvedValue(mockNewCourse);

      const req = { body: newCourseData } as Request;
      const res = mockResponse();

      await courseController.addCourse(req, res);

      expect(courseService.addCourse).toHaveBeenCalledWith("Physics");
      expect(logger.info).toHaveBeenCalledWith("Course added successfully");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        message: "Course added successfully",
        newCourse: mockNewCourse,
      });
    });

    it("should handle errors when adding course", async () => {
      const error = new Error("Error adding course");
      (courseService.addCourse as jest.Mock).mockRejectedValue(error);

      const req = { body: { course_name: "Physics" } } as Request;
      const res = mockResponse();

      await courseController.addCourse(req, res);

      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while adding the course.",
      });
    });
  });

  describe("updateCourse", () => {
    it("should update course successfully", async () => {
      const updatedCourseData = { course_id: 1, name: "Updated Math" };
      const mockUpdatedCourse = { id: 1, ...updatedCourseData };
      (courseService.updateCourse as jest.Mock).mockResolvedValue(
        mockUpdatedCourse
      );

      const req = { body: updatedCourseData } as Request;
      const res = mockResponse();

      await courseController.updateCourse(req, res);

      expect(courseService.updateCourse).toHaveBeenCalledWith(
        1,
        updatedCourseData
      );
      expect(logger.info).toHaveBeenCalledWith("Course updated successfully");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Course updated successfully",
        updatedCourse: mockUpdatedCourse,
      });
    });

    it("should return 404 if course not found", async () => {
      const updatedCourseData = { course_id: 99, name: "Nonexistent Course" };
      (courseService.updateCourse as jest.Mock).mockResolvedValue(null);

      const req = { body: updatedCourseData } as Request;
      const res = mockResponse();

      await courseController.updateCourse(req, res);

      expect(logger.error).toHaveBeenCalledWith(
        "Course not found or no changes made"
      );
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Course not found or no changes made.",
      });
    });

    it("should handle errors when updating course", async () => {
      const error = new Error("Error updating course");
      (courseService.updateCourse as jest.Mock).mockRejectedValue(error);

      const req = { body: { course_id: 1, name: "Updated Math" } } as Request;
      const res = mockResponse();

      await courseController.updateCourse(req, res);

      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while updating the course.",
      });
    });
  });
});
