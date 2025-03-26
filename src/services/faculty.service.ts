import Faculty from "../models/faculty.model";
import { logger } from "../config/logger";

const facultyService = {
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

  async addFaculty(data: any) {
    try {
      const newFaculty = await Faculty.create(data);

      return {
        ...newFaculty.toJSON(),
      };
    } catch (error) {
      throw new Error("Error adding new faculty" + error);
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
