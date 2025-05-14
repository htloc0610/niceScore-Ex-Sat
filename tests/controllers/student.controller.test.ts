import studentController from "../../src/controllers/student.controller";
import studentService from "../../src/services/student.service";
import configurationService from "../../src/services/configurations.service";
import { Request, Response } from "express";

jest.mock("../../src/services/student.service");
jest.mock("../../src/services/configurations.service");
jest.mock("../../src/models/status_transitions.model");
jest.mock("../../src/config/logger");

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis();
  res.send = jest.fn().mockReturnThis();
  return res as Response;
};

describe("studentController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getStudentHome", () => {
    it("should return students list", async () => {
      (studentService.getListStudent as jest.Mock).mockResolvedValue([{ id: 1 }]);
      const req = {} as Request;
      const res = mockResponse();

      await studentController.getStudentHome(req, res);

      expect(studentService.getListStudent).toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith({
        message: "Welcome to the Student Home Page",
        students: [{ id: 1 }],
      });
    });

    it("should handle errors", async () => {
      (studentService.getListStudent as jest.Mock).mockRejectedValue(new Error("fail"));
      const req = {} as Request;
      const res = mockResponse();

      await studentController.getStudentHome(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching students.",
      });
    });
  });

  describe("getStudentById", () => {
    it("should return student if found", async () => {
      (studentService.getStudentById as jest.Mock).mockResolvedValue({ id: 1 });
      const req = { params: { id: "1" } } as unknown as Request;
      const res = mockResponse();

      await studentController.getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        message: "Student found",
        student: { id: 1 },
      });
    });

    it("should return 404 if not found", async () => {
      (studentService.getStudentById as jest.Mock).mockResolvedValue(null);
      const req = { params: { id: "2" } } as unknown as Request;
      const res = mockResponse();

      await studentController.getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Student not found" });
    });

    it("should handle errors", async () => {
      (studentService.getStudentById as jest.Mock).mockRejectedValue(new Error("fail"));
      const req = { params: { id: "1" } } as unknown as Request;
      const res = mockResponse();

      await studentController.getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while fetching the student.",
      });
    });
  });

  describe("addStudent", () => {
    it("should return 400 for invalid email", async () => {
      (configurationService.getConfiguration as jest.Mock).mockResolvedValue({ config_value: "gmail.com" });
      const req = {
        body: { email: "test@yahoo.com", phone_number: "+84123456789" },
      } as Request;
      const res = mockResponse();

      await studentController.addStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid email domain. Please use a gmail.com email.",
      });
    });

    it("should return 400 for invalid phone", async () => {
      (configurationService.getConfiguration as jest.Mock)
        .mockResolvedValueOnce({ config_value: "gmail.com" })
        .mockResolvedValueOnce({ config_value: "^\\+84" });
      const req = {
        body: { email: "test@gmail.com", phone_number: "0123456789" },
      } as Request;
      const res = mockResponse();

      await studentController.addStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({
        message: "Invalid phone number. Please use a valid phone number.",
      });
    });
  });

  describe("deleteStudent", () => {
    it("should delete student successfully", async () => {
      (studentService.deleteStudent as jest.Mock).mockResolvedValue(1);
      const req = { body: { student_id: 1 } } as Request;
      const res = mockResponse();

      await studentController.deleteStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ message: "Student deleted successfully" });
    });

    it("should return 404 if student not found", async () => {
      (studentService.deleteStudent as jest.Mock).mockResolvedValue(0);
      const req = { body: { student_id: 2 } } as Request;
      const res = mockResponse();

      await studentController.deleteStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({ message: "Student not found" });
    });

    it("should handle errors", async () => {
      (studentService.deleteStudent as jest.Mock).mockRejectedValue(new Error("fail"));
      const req = { body: { student_id: 3 } } as Request;
      const res = mockResponse();

      await studentController.deleteStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        message: "An error occurred while deleting the student.",
      });
    });
  });

  // You can add similar tests for updateStudentById and updateStudent
});
