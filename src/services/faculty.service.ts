import Faculty from "../models/faculty.model";
import { logger } from "../config/logger";

const facultyService = {
  // Get list of faculties
  async getAllFaculties() {
    try {
      const faculties = await Faculty.findAll({
        order: [["faculty_id", "ASC"]],
      });
      return faculties.map(faculty => faculty.dataValues);
    } catch (error) {
      logger.error("Error fetching all faculties");
      throw new Error("Error fetching all faculties");
    }
  },

  async getFacultyById(facultyId: number) {
    try {
      const faculty = await Faculty.findOne({
        where: { faculty_id: facultyId },
      });
      if (!faculty) {
        logger.warn(`Faculty with ID ${facultyId} not found`);
        return null;
      }
      return faculty.get();
    } catch (error) {
      logger.error("Error fetching faculty by ID: " + error.message);
      throw new Error("Error fetching faculty by ID");
    }
  },
  // Get list of faculties
  async getFaculties() {
    try {
      const faculties = await Faculty.findAll();
      return faculties;
    } catch (error) {
      logger.error("Error fetching faculties list");
      throw new Error("Error fetching faculties list");
    }
  },
  async addFaculty(name_vi: string, name_en: string) {
    console.log("Adding a new faculty", { name_vi, name_en });
    try {
      const newFaculty = await Faculty.create({
        name_vi,
        name_en
      });
      logger.info("Added new faculty successfully");
      return newFaculty.toJSON();
    } catch (error) {
      logger.error("Error adding new faculty: " + error.message);
      throw new Error("Error adding new faculty: " + error.message);
    }
  },

  async updateFaculty(facultyId: number, facultyData: any) {
    try {
      const [updated] = await Faculty.update(facultyData, {
        where: { faculty_id: facultyId },
      });

      if (updated === 0) {
        throw new Error("Faculty not found");
      }
      const updatedFaculty = await Faculty.findOne({
        where: { faculty_id: facultyId },
      });
      return updatedFaculty ? updatedFaculty.get() : null;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};

export default facultyService;
