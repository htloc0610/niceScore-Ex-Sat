import ClassRegistration from "../models/class_registrations.model";
import RegistrationCancellation from "../models/registration_cancellations.model";
import Student from "../models/student.model";
import Class from "../models/classes.model";
import Transcript from "../models/transcripts.model";
import Module from "../models/modules.model";
import { logger } from "../config/logger";
import { Op } from "sequelize";

const classRegistationService = {
  async getAllRegistrations() {
    try {
      const registrations = await ClassRegistration.findAll({
        include: [
          {
            model: Student,
            as: "student",
            attributes: ["student_id", "full_name", "email"],
          },
          {
            model: Class,
            as: "class",
            attributes: [
              "class_id",
              "class_name",
              "academic_year",
              "module_id",
              "instructor",
              "schedule",
              "classroom",
            ],
          },
        ],
        order: [["registration_id", "ASC"]],
      });
      return registrations.map((reg) => reg.dataValues);
    } catch (error) {
      logger.error("Error fetching all registrations");
      throw new Error("Error fetching all registrations");
    }
  },

  async hasPrerequisiteCompleted(class_id: number, student_id: number) {
    try {
      console.log(class_id, student_id);

      // Find the class by class_id
      const classDetails = await Class.findByPk(class_id);
      if (!classDetails) {
        throw new Error("Class not found");
      }

      // Get the module_id of the class
      const module_id = classDetails.module_id;

      // Find the module by module_id
      const moduleDetails = await Module.findByPk(module_id);
      if (!moduleDetails) {
        throw new Error("Module not found");
      }

      console.log(moduleDetails);

      // Check the prerequisite_id of the module
      const prerequisite_id = moduleDetails.prerequisite_id;

      console.log(prerequisite_id);

      // If no prerequisite, return true
      if (!prerequisite_id) {
        return true;
      }

      // Find all classes belonging to the prerequisite module
      const prerequisiteClasses = await Class.findAll({
        where: { module_id: prerequisite_id },
      });

      // Extract class_ids of prerequisite classes
      const prerequisiteClassIds = prerequisiteClasses.map(
        (cls) => cls.class_id
      );

      // Check the Transcript table for the student
      const transcriptRecord = await Transcript.findOne({
        where: {
          student_id: student_id,
          class_id: prerequisiteClassIds,
          grade: { [Op.gte]: 5 }, // grade >= 5
        },
      });

      // If at least one record exists, return true
      return !!transcriptRecord;
    } catch (error) {
      logger.error(
        `Error checking prerequisite completion for class ID ${class_id} and student ID ${student_id}: ${error.message}`
      );
      throw new Error(
        `Error checking prerequisite completion: ${error.message}`
      );
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
      const createdRegistration = await ClassRegistration.create(
        newRegistrationData
      );
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
            attributes: ["student_id", "full_name", "email"],
          },
          {
            model: Class,
            as: "class",
            attributes: [
              "class_id",
              "class_name",
              "academic_year",
              "module_id",
              "instructor",
              "schedule",
              "classroom",
            ],
          },
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

      logger.info(
        `Deleted registration with ID: ${registrationId} and saved cancellation reason`
      );
      return {
        message:
          "Registration deleted successfully and cancellation reason saved",
      };
    } catch (error) {
      logger.error("Error deleting registration: " + error.message);
      throw new Error("Error deleting registration: " + error.message);
    }
  },

  //getRegistrationsByClassId
  async getRegistrationsByClassId(classId: number) {
    try {
      const registrations = await ClassRegistration.findAll({
        where: { class_id: classId },
        include: [
          {
            model: Student,
            as: "student",
            attributes: ["student_id", "full_name", "email", "phone_number"],
            include: [
              {
                model: Transcript,
                as: "transcripts",
                where: { class_id: classId }, // only get the grade for this class
                required: false, // allows students with no grade yet
                attributes: ["grade"],
              },
            ],
          },

          /*{
            model: Class,
            as: "class", 
          },*/
        ],
      });

      // Return plain objects
      return registrations.map((reg) => {
        let plain = reg.toJSON();
        const grade = plain.student.transcripts?.[0]?.grade ?? null; // Access the first grade
        return {
          ...plain,
          student: {
            ...plain.student,
            grade: grade, // Flattened grade field
          },
        };
      });
    } catch (error) {
      logger.error(
        `Error fetching registrations by class ID ${classId}: ${error.message}`
      );
      throw new Error(
        `Error fetching registrations by class ID: ${error.message}`
      );
    }
  },
};

export default classRegistationService;
