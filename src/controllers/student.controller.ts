import { Request, Response } from "express";
import studentService from "../services/student.service";
import configurationService from "../services/configurations.service";
import StatusTransition from "../models/status_transitions.model";
import { logger } from "../config/logger";

const studentController = {
  getStudentHome: async (req: Request, res: Response): Promise<void> => {
    try {
      const students = await studentService.getListStudent();
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

  getStudentById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const studentId = parseInt(id, 10);
      
      // Check if studentId is a valid number
      if (isNaN(studentId)) {
        logger.error(`Invalid student ID: ${id}`);
        res.status(400).send({ 
          message: "Invalid student ID", 
          error: `The provided ID '${id}' is not a valid number`
        });
        return;
      }
      
      const student = await studentService.getStudentById(studentId);
      
      if (!student) {
        logger.error(`Student with ID ${id} not found`);
        res.status(404).send({ 
          message: "Student not found", 
          error: `No student found with ID ${id}`
        });
      } else {
        logger.info(`Student with ID ${id} found`);
        res.status(200).send({ message: "Student found", student });
      }
    } catch (error) {
      logger.error("Error fetching student: " + error.message);
      console.error(error);
      res
        .status(500)
        .send({ 
          message: "An error occurred while fetching the student.",
          error: error.message
        });
    }
  },

  updateStudentById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const studentId = parseInt(id, 10);
      
      // Check if studentId is a valid number
      if (isNaN(studentId)) {
        logger.error(`Invalid student ID for update: ${id}`);
        res.status(400).send({ 
          message: "Invalid student ID", 
          error: `The provided ID '${id}' is not a valid number`
        });
        return;
      }
      
      const updatedData = req.body;
      const email = updatedData.email;
      const phone_number = updatedData.phone_number;

      // Check if the student exists before proceeding
      const existingStudent = await studentService.getStudentById(studentId);
      if (!existingStudent) {
        logger.error(`Student with ID ${id} not found for update`);
        res.status(404).send({ 
          message: "Student not found", 
          error: `No student found with ID ${id}`
        });
        return;
      }

      // Check if the email domain is allowed
      const emailConfig = await configurationService.getConfiguration(
        "allowed_email_domain"
      );
      const emailRegex = new RegExp(
        `^[a-zA-Z0-9._%+-]+@${emailConfig.config_value}$`
      );
      if (email && !emailRegex.test(email)) {
        logger.error("Invalid email domain");
        res
          .status(400)
          .send({
            message: `Invalid email domain. Please use a ${emailConfig.config_value} email.`,
          });
        return;
      }

      // Check if the phone number is valid
      const phoneConfig = await configurationService.getConfiguration(
        "phone_country_code"
      );
      const phoneRegex = new RegExp(
        phoneConfig.config_value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      );
      if (phone_number && !phoneRegex.test(phone_number)) {
        logger.error("Invalid phone number");
        res
          .status(400)
          .send({
            message: "Invalid phone number. Please use a valid phone number.",
          });
        return;
      }

      // Check if the status transition is allowed
      const currentStatus = await studentService.getStudentStatus(studentId);

      const newStatus = updatedData.status_id;

      console.log("currentStatus:", currentStatus);
      console.log("newStatus:", newStatus);

      // Don't check status transition if the status hasn't changed
      if (currentStatus != newStatus) {
        const statusTransition = await StatusTransition.findOne({
          where: { current_status: currentStatus, new_status: newStatus },
        });
        
        if (!statusTransition) {
          logger.error("Invalid status transition");
          res.status(400).send({ message: "Invalid status transition." });
          return;
        }
      }
      
      const updated = await studentService.updateStudentById(
        studentId,
        updatedData
      );
      
      res.status(200).send({ message: "Student updated successfully", student: updated });
    } catch (error) {
      logger.error("Error updating student: " + error.message);
      console.error(error);
      res
        .status(500)
        .send({ 
          message: "An error occurred while updating the student.",
          error: error.message 
        });
    }
  },

  addStudent: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;

      // Check if the email domain is allowed
      const emailConfig = await configurationService.getConfiguration(
        "allowed_email_domain"
      );
      const emailRegex = new RegExp(
        `^[a-zA-Z0-9._%+-]+@${emailConfig.config_value}$`
      );
      if (!emailRegex.test(data.email)) {
        logger.error("Invalid email domain");
        res
          .status(400)
          .send({
            message: `Invalid email domain. Please use a ${emailConfig.config_value} email.`,
          });
        return;
      }

      // Check if the phone number is valid
      const phoneConfig = await configurationService.getConfiguration(
        "phone_country_code"
      );
      const phoneRegex = new RegExp(
        phoneConfig.config_value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      );
      if (!phoneRegex.test(data.phone_number)) {
        logger.error("Invalid phone number");
        res
          .status(400)
          .send({
            message: "Invalid phone number. Please use a valid phone number.",
          });
        return;
      }

      const newStudent = await studentService.addStudent(data);
      //const newStudent = "ok";
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

      // Check if the email domain is allowed
      const emailConfig = await configurationService.getConfiguration(
        "allowed_email_domain"
      );
      const emailRegex = new RegExp(
        `^[a-zA-Z0-9._%+-]+@${emailConfig.config_value}$`
      );
      if (email && !emailRegex.test(email)) {
        logger.error("Invalid email domain");
        res
          .status(400)
          .send({
            message: `Invalid email domain. Please use a ${emailConfig.config_value} email.`,
          });
        return;
      }

      // Check if the phone number is valid
      const phoneConfig = await configurationService.getConfiguration(
        "phone_country_code"
      );
      const phoneRegex = new RegExp(
        phoneConfig.config_value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      );
      if (phone_number && !phoneRegex.test(phone_number)) {
        logger.error("Invalid phone number");
        res
          .status(400)
          .send({
            message: "Invalid phone number. Please use a valid phone number.",
          });
        return;
      }

      // Check if the status transition is allowed
      const currentStatus = await studentService.getStudentStatus(studentId);
      const newStatus = status;
      const statusTransition = await StatusTransition.findOne({
        where: { current_status: currentStatus, new_status: newStatus },
      });
      if (!statusTransition) {
        logger.error("Invalid status transition");
        res.status(400).send({ message: "Invalid status transition." });
        return;
      }

      const updatedStudent = await studentService.updateStudent(
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
        updatedStudent.faculty_name_en = faculty.name_en;
        updatedStudent.faculty_name_vn = faculty.name_vi;
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
      const { student_id } = req.body;

      const result = await studentService.deleteStudent(student_id);

      // Log để kiểm tra dữ liệu trả về
      logger.info("Delete result:", result);

      // Xử lý tùy theo kiểu trả về
      const isDeleted = typeof result === 'number' ? result > 0 : (result as any)?.affectedRows > 0;

      if (isDeleted) {
        logger.info(`Student with ID ${student_id} deleted successfully`);
        res.status(200).json({ message: "Student deleted successfully" });
      } else {
        logger.warn(`Student with ID ${student_id} not found`);
        res.status(404).json({ message: "Student not found" });
      }
    } catch (error) {
      logger.error("Error deleting student:", error);
      res.status(500).send({
        message: "An error occurred while deleting the student."
      });
    }
  },
};

export default studentController;
