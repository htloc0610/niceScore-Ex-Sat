import request from "supertest";
import express from "express";
import studentRouter from "../../src/routes/student.router";
import studentController from "../../src/controllers/student.controller";

// Mock controller methods
jest.mock("../../src/controllers/student.controller");

const app = express();
app.use(express.json());
app.use("/api/student", studentRouter);

describe("Student Router", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/student", () => {
    it("should fetch student home successfully", async () => {
      (studentController.getStudentHome as jest.Mock).mockImplementation(
        (req, res) => {
          res
            .status(200)
            .send({ message: "Student home fetched successfully" });
        }
      );

      const response = await request(app).get("/api/student");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Student home fetched successfully");
      expect(studentController.getStudentHome).toHaveBeenCalled();
    });
  });

  describe("GET /api/student/:id", () => {
    it("should fetch student by ID successfully", async () => {
      const studentId = 1;
      const mockStudent = { id: studentId, name: "John Doe", age: 20 };

      (studentController.getStudentById as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(200).send({ student: mockStudent });
        }
      );

      const response = await request(app).get(`/api/student/${studentId}`);

      expect(response.status).toBe(200);
      expect(response.body.student).toEqual(mockStudent);
      expect(studentController.getStudentById).toHaveBeenCalled();
    });

    it("should return 404 if student not found", async () => {
      const studentId = 999;

      (studentController.getStudentById as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(404).send({ message: "Student not found" });
        }
      );

      const response = await request(app).get(`/api/student/${studentId}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Student not found");
    });
  });

  describe("POST /api/student", () => {
    it("should add a new student", async () => {
      const newStudent = { name: "Jane Doe", age: 22 };

      (studentController.addStudent as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(201).send({
            message: "Student added successfully",
            student: newStudent,
          });
        }
      );

      const response = await request(app).post("/api/student").send(newStudent);

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Student added successfully");
      expect(response.body.student).toEqual(newStudent);
      expect(studentController.addStudent).toHaveBeenCalled();
    });
  });

  describe("PUT /api/student/:id", () => {
    it("should update student by ID", async () => {
      const studentId = 1;
      const updatedStudent = {
        id: studentId,
        name: "John Doe Updated",
        age: 21,
      };

      (studentController.updateStudentById as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(200).send({
            message: "Student updated successfully",
            student: updatedStudent,
          });
        }
      );

      const response = await request(app)
        .put(`/api/student/${studentId}`)
        .send(updatedStudent);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Student updated successfully");
      expect(response.body.student).toEqual(updatedStudent);
      expect(studentController.updateStudentById).toHaveBeenCalled();
    });

    it("should return 404 if student to update not found", async () => {
      const studentId = 999;
      const updatedStudent = { name: "John Doe Updated", age: 21 };

      (studentController.updateStudentById as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(404).send({ message: "Student not found" });
        }
      );

      const response = await request(app)
        .put(`/api/student/${studentId}`)
        .send(updatedStudent);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Student not found");
    });
  });

  describe("DELETE /api/student", () => {
    it("should delete a student", async () => {
      const studentId = 1;

      (studentController.deleteStudent as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(200).send({ message: "Student deleted successfully" });
        }
      );

      const response = await request(app)
        .delete("/api/student")
        .send({ id: studentId });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Student deleted successfully");
      expect(studentController.deleteStudent).toHaveBeenCalled();
    });

    it("should return 404 if student to delete not found", async () => {
      const studentId = 999;

      (studentController.deleteStudent as jest.Mock).mockImplementation(
        (req, res) => {
          res.status(404).send({ message: "Student not found" });
        }
      );

      const response = await request(app)
        .delete("/api/student")
        .send({ id: studentId });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Student not found");
    });
  });
});
