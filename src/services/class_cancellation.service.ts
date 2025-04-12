import RegistrationCancellation from "../models/registration_cancellations.model";
import Student from "../models/student.model";
import Class from "../models/classes.model";
import { logger } from "../config/logger";

const classRegistationService = {
  async getAllCancellations() {
    try {
      const registrations = await RegistrationCancellation.findAll({
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
        order: [["cancellation_id", "ASC"]],
      });
      return registrations.map((reg) => reg.get({ plain: true }));
    } catch (error) {
      logger.error("Error fetching all cancellations", error);
      throw new Error("Error fetching all cancellations");
    }
  },
};

export default classRegistationService;
