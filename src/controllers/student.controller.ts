import { Request, Response } from "express";
import studentService from "../services/student.service";
import { logger } from "../config/logger";

const studentController = {
  getStudentHome: async (req: Request, res: Response): Promise<void> => {
    try {
      const students = await studentService.getList();
      logger.info("Successfully fetched students list");
      res.send({ message: "Welcome to the Student Home Page", students });
    } catch (error) {
      logger.error("Error fetching students list: " + error.message);
      console.log("Error fetching students list:", error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching students." });
    }
  },
  //getStudentById
  getStudentById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const student = await studentService.getStudentById(parseInt(id, 10));
      if (!student) {
        logger.error(`Student with ID ${id} not found`);
        res.status(404).send({ message: "Student not found" });
      } else {
        logger.info(`Student with ID ${id} found`);
        res.status(200).send({ message: "Student found", student });
      }
    } catch (error) {
      logger.error("Error fetching student: " + error.message);
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the student." });
    }
  },

  //updateStudentById
  updateStudentById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedData = req.body;
      const updatedStudent = await studentService.updateStudentById(
        parseInt(id, 10),
        updatedData
      );
      if (!updatedStudent) {
        logger.error(`Student with ID ${id} not found or no changes made.`);
        res
          .status(404)
          .send({ message: "Student not found or no changes made." });
      } else {
        logger.info(`Student with ID ${id} updated successfully`);
        res.status(200).send({
          message: "Student updated successfully",
          updatedStudent,
        });
      }
    } catch (error) {
      logger.error("Error updating student: " + error.message);
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the student." });
    }
  },
  addStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const newStudent = await studentService.addStudent(data);
      logger.info("Student added successfully");
      res
        .status(201)
        .send({ message: "Student added successfully", newStudent });
    } catch (error) {
      logger.error("Error adding new student" + error);
      console.log("Error adding new student:", error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the student." });
    }
  },
  updateStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        student_id,
        full_name,
        date_of_birth,
        gender,
        faculty_id,
        course,
        program,
        address,
        email,
        phone_number,
        status,
      } = req.body;
      const updatedData = req.body;

      const studentId = parseInt(student_id, 10);
      const updatedStudent = await studentService.update(
        studentId,
        updatedData
      );

      if (!updatedStudent) {
        res
          .status(404)
          .send({ message: "Student not found or no changes made." });
      } else {
        //before sending the response, we need to get Faculty name
        const faculty = await studentService.getFacultyName(faculty_id);
        updatedStudent.faculty_id = faculty.name;
        logger.info("Student updated successfully");
        res.status(200).send({
          message: "Student updated successfully",
          updatedStudent,
        });
      }
    } catch (error) {
      logger.error("Error updating student" + error);
      console.log("Error updating student:", error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the student." });
    }
  },
  deleteStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const { student_id } = req.body; // Extract the student ID from the request body
      // Call the delete function in your service
      const result = await studentService.delete(student_id);

      // If the student was successfully deleted, return a success response
      if (result === 0) {
        logger.error("Student not found");
        res.status(404).send({ message: "Student not found" });
      } else {
        logger.info("Student deleted successfully");
        res.status(200).send({ message: "Student deleted successfully" });
      }
    } catch (error) {
      logger.error("Error deleting student" + error);
      console.log("Error deleting student:", error);
      res
        .status(500)
        .send({ message: "An error occurred while deleting the student." });
    }
  },
};

export default studentController;
