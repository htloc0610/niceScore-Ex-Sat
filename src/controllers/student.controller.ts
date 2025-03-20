import { Request, Response } from "express";
import studentService from "../services/student.service";
import {logger} from "../config/logger";

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
  getListFaculties: async (req: Request, res: Response): Promise<void> => {
    try {
      const faculties = await studentService.getFaculties();
      logger.info("Successfully fetched faculties list");
      res.send({ message: "List of faculties", faculties });
    } catch (error) {
      logger.error("Error fetching faculties list");
      console.log("Error fetching faculties list:", error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching faculties." });
    }
  },
  getListStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const status = await studentService.getStatus();
      res.send({ message: "List of status", status });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching status." });
    }
  },
  getListCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const courses = await studentService.getCourses();
      res.send({ message: "List of courses", courses });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching courses." });
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
  addFaculty: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const newFaculty = await studentService.addFaculty(data);
      res
        .status(201)
        .send({ message: "Faculty added successfully", newFaculty });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the faculty." });
    }
  },

  updateFaculty: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        faculty_id, name
      } = req.body;
      const updatedData = req.body;
      console.log(updatedData, "id", faculty_id);
      const updatedFaculty = await studentService.updateFaculty(
        faculty_id,
        updatedData
      );

      if (!updatedFaculty) {
        res
          .status(404)
          .send({ message: "Faculty not found or no changes made." });
      } else {
        res.status(200).send({
          message: "Faculty updated successfully",
          updatedFaculty,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the faculty." });
    }
  },
  addStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const newStatus = await studentService.addStatus(data);
      res
        .status(201)
        .send({ message: "Status added successfully", newStatus });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the status." });
    }
  },

  updateStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        status_id, name
      } = req.body;
      const updatedData = req.body;
      const updatedStatus = await studentService.updateStatus(
        status_id,
        updatedData
      );

      if (!updatedStatus) {
        res
          .status(404)
          .send({ message: "Status not found or no changes made." });
      } else {
        res.status(200).send({
          message: "Status updated successfully",
          updatedStatus,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the status." });
    }
  },

  //add course
  addCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const newCourse = await studentService.addCourse(data);
      res
        .status(201)
        .send({ message: "Course added successfully", newCourse });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the course." });
    }
  },

  //update course
  updateCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const {
        course_id, name
      } = req.body;
      const updatedData = req.body;
      const updatedCourse = await studentService.updateCourse(
        course_id,
        updatedData
      );

      if (!updatedCourse) {
        res
          .status(404)
          .send({ message: "Course not found or no changes made." });
      } else {
        res.status(200).send({
          message: "Course updated successfully",
          updatedCourse,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the course." });
    }
  },
};

export default studentController;
