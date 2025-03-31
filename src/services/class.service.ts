import Modules from "../models/modules.model";
import Class from "../models/classes.model";
import { logger } from "../config/logger";

const facultyService = {
  async getAllClasses() {
    try {
      const classes = await Class.findAll({
        order: [["class_id", "ASC"]],
      });
      return classes.map(cls => cls.dataValues);
    } catch (error) {
      logger.error("Error fetching all classes");
      throw new Error("Error fetching all classes");
    }
  },

  async createClass(newClassData: any) {
    try {
      const createdClass = await Class.create(newClassData);
      logger.info("Created new class successfully");
      return createdClass.toJSON();
    } catch (error) {
      logger.error("Error creating new class: " + error.message);
      throw new Error("Error creating new class: " + error.message);
    }
  },

  async getClassById(classId: number) {
    try {
      const cls = await Class.findOne({
      where: { class_id: classId },
      });

      if (!cls) {
      throw new Error("Class not found");
      }

      return cls.get();
    } catch (error) {
      logger.error("Error fetching class by ID: " + error.message);
      throw new Error("Error fetching class by ID: " + error.message);
    }
  },

  async updateClass(classId: number, updatedData: any) {
    try {
      const [updated] = await Class.update(updatedData, {
        where: { class_id: classId },
      });

      if (updated === 0) {
        throw new Error("Class not found");
      }
      const updatedClass = await Class.findOne({
        where: { class_id: classId },
      });
      return updatedClass ? updatedClass.get() : null;
    } catch (error) {
      logger.error("Error updating class: " + error.message);
      throw new Error("Error updating class: " + error.message);
    }
  },

  async deleteClass(classId: number) {
    try {
      const deleted = await Class.destroy({
      where: { class_id: classId },
      });

      if (deleted === 0) {
      throw new Error("Class not found");
      }

      logger.info(`Deleted class with ID: ${classId}`);
      return { message: "Class deleted successfully" };
    } catch (error) {
      logger.error("Error deleting class: " + error.message);
      throw new Error("Error deleting class: " + error.message);
    }
    }
};

export default facultyService;
