import Modules from "../models/modules.model";
import Class from "../models/classes.model";
import ClassRegistration from "../models/class_registrations.model";
import { logger } from "../config/logger";

const moduleService = {
  async getAllModules() {
    try {
      const modules = await Modules.findAll({
        order: [["module_id", "ASC"]],
      });
      return modules.map(module => module.dataValues);
    } catch (error) {
      logger.error("Error fetching all modules");
      throw new Error("Error fetching all modules");
    }
  },

  async addModule(data: any) {
    try {
      const newModule = await Modules.create(data);
      logger.info("Added new module successfully");
      return newModule.toJSON();
    } catch (error) {
      logger.error("Error adding new module: " + error.message);
      throw new Error("Error adding new module: " + error.message);
    }
  },

  async getModuleById(moduleId: number) {
    try {
      const module = await Modules.findOne({
      where: { module_id: moduleId },
      });

      if (!module) {
      throw new Error("Module not found");
      }

      return module.dataValues;
    } catch (error) {
      logger.error("Error fetching module by ID: " + error.message);
      throw new Error("Error fetching module by ID: " + error.message);
    }
  },

  async hasRegisterStudent(moduleId: number) {
    try {
      const registeredStudent = await Class.findOne({
        where: { module_id: moduleId },
        include: [
          {
            model: ClassRegistration,
            as: "registrations",
            required: true,
          },
        ],
      });

      if (registeredStudent) {
        logger.info("Module has registered students");
        return true;
      } else {
        logger.info("Module has no registered students");
        return false;
      }
    } catch (error) {
      logger.error("Error checking registered students: " + error.message);
      throw new Error("Error checking registered students: " + error.message);
    }
  },

  async updateModule(moduleId: number, updatedData: any) {
    try {
      const [updated] = await Modules.update(updatedData, {
        where: { module_id: moduleId },
      });

      if (updated === 0) {
        throw new Error("Module not found");
      }
      const updatedModule = await Modules.findOne({
        where: { module_id: moduleId },
      });
      return updatedModule ? updatedModule.get() : null;
    } catch (error) {
      logger.error("Error updating module: " + error.message);
      throw new Error("Error updating module: " + error.message);
    }
  },
  async deleteModule(moduleId: number) {
    try {
      const deleted = await Modules.destroy({
        where: { module_id: moduleId },
      });

      if (deleted === 0) {
        throw new Error("Module not found");
      }

      logger.info("Deleted module successfully");
      return { message: "Module deleted successfully" };
    } catch (error) {
      logger.error("Error deleting module: " + error.message);
      throw new Error("Error deleting module: " + error.message);
    }
  },
  async isModuleOlderThan30Minutes(moduleId: number) {
    try {
      const module = await Modules.findOne({
        where: { module_id: moduleId },
      });

      if (!module) {
        throw new Error("Module not found");
      }

      const createdAt = module.getDataValue("createdAt");
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

      return createdAt < thirtyMinutesAgo;
    } catch (error) {
      logger.error("Error checking module age: " + error.message);
      throw new Error("Error checking module age: " + error.message);
    }
  },
  async hasLinkedClasses(moduleId: number) {
    try {
      const linkedClass = await Class.findOne({
        where: { module_id: moduleId },
      });

      if (linkedClass) {
        logger.info("Module has linked classes");
        return true;
      } else {
        logger.info("Module has no linked classes");
        return false;
      }
    } catch (error) {
      logger.error("Error checking linked classes: " + error.message);
      throw new Error("Error checking linked classes: " + error.message);
    }
  }
};

export default moduleService;
