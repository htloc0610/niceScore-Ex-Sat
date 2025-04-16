import request from "supertest";
import express from "express";
import courseRouter from "../../src/routes/course.router";
import courseController from "../../src/controllers/course.controller";

// Mock controller methods
jest.mock("../../src/controllers/course.controller");

const app = express();
app.use(express.json());
app.use("/api/course", courseRouter);

describe("Course Router", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/course", () => {
    it("should fetch list of courses", async () => {
      const mockCourses = [
        { id: 1, course_name: "Mathematics" },
        { id: 2, course_name: "Physics" },
      ];
      (courseController.getListCourse as jest.Mock).mockImplementation(
        async (req, res) => {
          res
            .status(200)
            .json({ message: "List of courses", courses: mockCourses });
        }
      );

      const response = await request(app).get("/api/course");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("List of courses");
      expect(response.body.courses).toEqual(mockCourses);
      expect(courseController.getListCourse).toHaveBeenCalled();
    });

    it("should return 500 if there is an error fetching courses", async () => {
      (courseController.getListCourse as jest.Mock).mockImplementation(
        async (req, res) => {
          res
            .status(500)
            .json({ message: "An error occurred while fetching courses." });
        }
      );

      const response = await request(app).get("/api/course");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "An error occurred while fetching courses."
      );
    });
  });

  describe("POST /api/course", () => {
    it("should return 500 if there is an error adding course", async () => {
      const newCourse = { course_name: "Chemistry" };

      (courseController.addCourse as jest.Mock).mockImplementation(
        async (req, res) => {
          res
            .status(500)
            .json({ message: "An error occurred while adding the course." });
        }
      );

      const response = await request(app).post("/api/course").send(newCourse);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "An error occurred while adding the course."
      );
    });
  });

  describe("PUT /api/course", () => {
    it("should return 500 if there is an error updating course", async () => {
      const updatedCourse = { course_name: "Advanced Chemistry" };

      (courseController.updateCourse as jest.Mock).mockImplementation(
        async (req, res) => {
          res
            .status(500)
            .json({ message: "An error occurred while updating the course." });
        }
      );

      const response = await request(app)
        .put("/api/course")
        .send(updatedCourse);

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(
        "An error occurred while updating the course."
      );
    });
  });
});
