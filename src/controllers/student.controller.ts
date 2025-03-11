import { Request, Response } from "express";
import studentService from "../services/student.service";

const studentController = {
  getStudentHome: async (req: Request, res: Response): Promise<void> => {
    try {
      const students = await studentService.getList();
      res.send({ message: "Welcome to the Student Home Page", students });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching students." });
    }
  },
  getListFaculties: async (req: Request, res: Response): Promise<void> => {
    try {
      const faculties = await studentService.getFaculties();
      res.send({ message: "List of faculties", faculties });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching faculties." });
    }
  },
  addStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const newStudent = await studentService.addStudent(data);
      console.log(newStudent);
      res
        .status(201)
        .send({ message: "Student added successfully", newStudent });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the student." });
    }
  },
};

export default studentController;
