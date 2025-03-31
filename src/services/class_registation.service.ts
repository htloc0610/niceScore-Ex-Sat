import ClassRegistration from "../models/class_registrations.model";
import RegistrationCancellation from "../models/registration_cancellations.model";
import Student from "../models/student.model";
import Class from "../models/classes.model";
import { logger } from "../config/logger";

const classRegistationService = {
  async getAllRegistrations() {
    try {
      const registrations = await ClassRegistration.findAll({
        include: [
          {
            model: Student,
            as: "student",
            attributes: ["student_id", "full_name", "email"]
          },
          {
            model: Class,
            as: "class",
            attributes: ["class_id", "class_name", "academic_year", "module_id", "instructor", "schedule", "classroom"],
          }
        ],
        order: [["registration_id", "ASC"]],
      });
      return registrations.map(reg => reg.dataValues);
    } catch (error) {
      logger.error("Error fetching all registrations");
      throw new Error("Error fetching all registrations");
    }
  },

  async availableRegistration(registrationData: any) {
    try {
      const existingRegistration = await ClassRegistration.findOne({
        where: {
          student_id: registrationData.student_id,
          class_id: registrationData.class_id,
        },
      });
      if (existingRegistration) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      logger.error("Error checking existing registration: " + error.message);
      throw new Error("Error checking existing registration: " + error.message);
    }
  },

  async fullOfStudent(classId: number) {
    try {
      const classDetails = await Class.findOne({
        where: { class_id: classId },
        attributes: ["max_students"],
      });

      if (!classDetails) {
        throw new Error("Class not found");
      }

      const totalRegistrations = await ClassRegistration.count({
        where: { class_id: classId },
      });

      return totalRegistrations >= classDetails.max_students;
    } catch (error) {
      logger.error("Error checking if class is full: " + error.message);
      throw new Error("Error checking if class is full: " + error.message);
    }
  },

  async addRegistration(newRegistrationData: any) {
    try {
      const createdRegistration = await ClassRegistration.create(newRegistrationData);
      logger.info("Created new registration successfully");
      return createdRegistration.toJSON();
    } catch (error) {
      logger.error("Error creating new registration: " + error.message);
      throw new Error("Error creating new registration: " + error.message);
    }
  },

  async getRegistrationById(registrationId: number) {
    try {
      const registration = await ClassRegistration.findOne({
        where: { registration_id: registrationId },
        include: [
          {
            model: Student,
            as: "student",
            attributes: ["student_id", "full_name", "email"]
          },
          {
            model: Class,
            as: "class",
            attributes: ["class_id", "class_name", "academic_year", "module_id", "instructor", "schedule", "classroom"],
          }
        ],
      });

      if (!registration) {
        throw new Error("Registration not found");
      }

      return registration.get();
    } catch (error) {
      logger.error("Error fetching registration by ID: " + error.message);
      throw new Error("Error fetching registration by ID: " + error.message);
    }
  },

  async updateRegistration(registrationId: number, updatedData: any) {
    try {
      const [updated] = await ClassRegistration.update(updatedData, {
        where: { registration_id: registrationId },
      });

      if (updated === 0) {
        throw new Error("Registration not found");
      }
      const updatedRegistration = await ClassRegistration.findOne({
        where: { registration_id: registrationId },
      });
      return updatedRegistration ? updatedRegistration.get() : null;
    } catch (error) {
      logger.error("Error updating registration: " + error.message);
      throw new Error("Error updating registration: " + error.message);
    }
  },

  async deleteRegistration(registrationId: number, reason: string) {
    try {
      const registration = await ClassRegistration.findOne({
        where: { registration_id: registrationId },
      });

      if (!registration) {
        throw new Error("Registration not found");
      }

      // Save cancellation reason to the registration_cancellations table
      await RegistrationCancellation.create({
        student_id: registration.student_id,
        class_id: registration.class_id,
        reason: reason,
      });

      // Delete the registration
      const deleted = await ClassRegistration.destroy({
        where: { registration_id: registrationId },
      });

      if (deleted === 0) {
        throw new Error("Failed to delete registration");
      }

      logger.info(`Deleted registration with ID: ${registrationId} and saved cancellation reason`);
      return { message: "Registration deleted successfully and cancellation reason saved" };
    } catch (error) {
      logger.error("Error deleting registration: " + error.message);
      throw new Error("Error deleting registration: " + error.message);
    }
  }
};

export default classRegistationService;
