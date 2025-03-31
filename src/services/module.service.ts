import Modules from "../models/modules.model";
import { logger } from "../config/logger";

const facultyService = {
  async getAllModules() {
    try {
      const modules = await Modules.findAll({
        attributes: ["module_id", "module_name"],
        order: [["module_id", "ASC"]],
      });
      return modules.map(module => module.dataValues);
    } catch (error) {
      logger.error("Error fetching all modules");
      throw new Error("Error fetching all modules");
    }
  },

  async addModule(data: { module_id: number; module_name: string }) {
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
      attributes: ["module_id", "module_name"],
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
};

export default facultyService;
