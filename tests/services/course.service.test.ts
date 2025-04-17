import courseService from "../../src/services/course.service";
import Course from "../../src/models/course.model";

jest.mock("../../src/models/course.model");
jest.mock("../../src/config/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe("courseService", () => {
  describe("getAllCourses", () => {
    it("should return a list of all courses", async () => {
      const mockCourses = [
        {
          dataValues: {
            course_id: 1,
            course_name: "Math 101",
          },
        },
        {
          dataValues: {
            course_id: 2,
            course_name: "Physics 101",
          },
        },
      ];

      (Course.findAll as jest.Mock).mockResolvedValue(mockCourses);

      const result = await courseService.getAllCourses();

      expect(Course.findAll).toHaveBeenCalled();
      expect(result).toEqual([
        mockCourses[0].dataValues,
        mockCourses[1].dataValues,
      ]);
    });

    it("should handle errors", async () => {
      (Course.findAll as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(courseService.getAllCourses()).rejects.toThrow(
        "Error fetching courses list"
      );
    });
  });

  describe("getCourses", () => {
    it("should return all courses", async () => {
      const mockCourses = [
        { course_id: 1, course_name: "Math 101" },
        { course_id: 2, course_name: "Physics 101" },
      ];

      (Course.findAll as jest.Mock).mockResolvedValue(mockCourses);

      const result = await courseService.getCourses();

      expect(Course.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCourses);
    });

    it("should handle errors", async () => {
      (Course.findAll as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(courseService.getCourses()).rejects.toThrow(
        "Error fetching courses list"
      );
    });
  });

  describe("updateCourse", () => {
    it("should update an existing course", async () => {
      const courseId = 1;
      const courseData = { course_name: "Math 102" };
      const mockUpdatedCourse = {
        course_id: courseId,
        course_name: "Math 102",
      };

      (Course.update as jest.Mock).mockResolvedValue([1]); // 1 row affected
      (Course.findOne as jest.Mock).mockResolvedValue({
        get: jest.fn(() => mockUpdatedCourse),
      });

      const result = await courseService.updateCourse(courseId, courseData);

      expect(Course.update).toHaveBeenCalledWith(courseData, {
        where: { course_id: courseId },
      });
      expect(result).toEqual(mockUpdatedCourse);
    });

    it("should return null if course not found", async () => {
      const courseId = 1;
      const courseData = { course_name: "Math 102" };

      (Course.update as jest.Mock).mockResolvedValue([0]); // No rows affected

      await expect(
        courseService.updateCourse(courseId, courseData)
      ).rejects.toThrow("Course not found");
    });

    it("should handle errors", async () => {
      const courseId = 1;
      const courseData = { course_name: "Math 102" };

      (Course.update as jest.Mock).mockRejectedValue(new Error("Test error"));

      await expect(
        courseService.updateCourse(courseId, courseData)
      ).rejects.toThrow("Test error");
    });
  });
});
