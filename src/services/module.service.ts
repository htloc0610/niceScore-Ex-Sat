import Modules from "../models/modules.model";
import Faculty from "../models/faculty.model";
import Class from "../models/classes.model";
import ClassRegistration from "../models/class_registrations.model";
import { logger } from "../config/logger";
import ModuleTranslation from "../models/module_translations.model";
import { Op } from "sequelize";
import sequelize from "../config/db";

const moduleService = {  async getAllModules(language = "en") {
    try {
      const modules = await Modules.findAll({
        include: [
          {
            model: Faculty,
            as: "faculty",
            attributes: ["name_en", "name_vi"],
          },
          {
            model: Modules,
            as: "prerequisite",
            attributes: ["module_code"], 
          },
          {
            model: ModuleTranslation,
            as: "translations",
            where: { language },
            required: false, // Left join to get modules even if they don't have a translation
          },
        ],
      });
  
      return modules.map((module) => {
        const plainModule = module.get({ plain: true });
        // Extract translation data and add it to the module object
        if (plainModule.translations && plainModule.translations.length > 0) {
          plainModule.module_name = plainModule.translations[0].module_name;
          plainModule.description = plainModule.translations[0].description;
        } else {
          // Default values if translation is not available
          plainModule.module_name = `[${plainModule.module_code}]`;
          plainModule.description = null;
        }
        
        // Remove the translations array from the returned object
        delete plainModule.translations;
        
        return plainModule;
      });
    } catch (error) {
      console.error("Error fetching modules:", error);
      throw error;
    }
  },
  
  async getModuleWithTranslations(moduleId: number) {
    try {
      const module = await Modules.findOne({
        where: { module_id: moduleId },
        include: [
          {
            model: Faculty,
            as: "faculty",
            attributes: ["name_en", "name_vi"],
          },
          {
            model: Modules,
            as: "prerequisite",
            attributes: ["module_code"],
          },
          {
            model: ModuleTranslation,
            as: "translations",
          },
        ],
      });

      if (!module) {
        throw new Error("Module not found");
      }

      return module.get({ plain: true });
    } catch (error) {
      logger.error("Error fetching module with translations: " + error.message);
      throw new Error("Error fetching module with translations: " + error.message);
    }
  },
  async addModule(data: any) {
    try {
      // Extract translation data
      const translations = data.translations || [];
      const { module_name, description, ...moduleData } = data;
      
      // Start transaction to ensure data integrity
      const result = await sequelize.transaction(async (t) => {
        // Create the module
        const newModule = await Modules.create(moduleData, { transaction: t });
        
        // Add translations if provided
        if (module_name) {
          // Create a default English translation if just module_name is provided
          await ModuleTranslation.create({
            module_id: newModule.module_id,
            language: 'en',
            module_name,
            description,
          }, { transaction: t });
        }
        
        // Add any additional translations
        if (translations.length > 0) {
          for (const translation of translations) {
            await ModuleTranslation.create({
              module_id: newModule.module_id,
              ...translation
            }, { transaction: t });
          }
        }
        
        // Return the newly created module
        return newModule;
      });
      
      logger.info("Added new module successfully");
      
      // Get the complete module with translations
      const completeModule = await this.getModuleWithTranslations(result.module_id);
      return completeModule;
    } catch (error) {
      logger.error("Error adding new module: " + error.message);
      throw new Error("Error adding new module: " + error.message);
    }
  },

  async getModuleById(moduleId: number, language = "en") {
    try {
      const module = await Modules.findOne({
        where: { module_id: moduleId },
        include: [
          {
            model: ModuleTranslation,
            as: "translations",
            where: { language },
            required: false,
          },
          {
            model: Faculty,
            as: "faculty",
            attributes: ["name_en", "name_vi"],
          },
          {
            model: Modules,
            as: "prerequisite",
            attributes: ["module_code"],
          },
        ],
      });

      if (!module) {
        throw new Error("Module not found");
      }

      const plainModule = module.get({ plain: true });
      
      // Extract translation data and add it to the module object
      if (plainModule.translations && plainModule.translations.length > 0) {
        plainModule.module_name = plainModule.translations[0].module_name;
        plainModule.description = plainModule.translations[0].description;
      } else {
        // Default values if translation is not available
        plainModule.module_name = `[${plainModule.module_code}]`;
        plainModule.description = null;
      }
      
      // Remove the translations array from the returned object
      delete plainModule.translations;
      
      return plainModule;
    } catch (error) {
      logger.error("Error fetching module by ID: " + error.message);
      throw new Error("Error fetching module by ID: " + error.message);
    }
  },
  async getModuleByIdNoLang(moduleId: number) {
    try {
      const module = await Modules.findOne({
        where: { module_id: moduleId },
        include: [
          {
            model: ModuleTranslation,
            as: "translations",
            attributes: ["language","module_name", "description"],
          },
          {
            model: Faculty,
            as: "faculty",
            attributes: ["name_en", "name_vi"],
          },
          {
            model: Modules,
            as: "prerequisite",
            attributes: ["module_code"],
          },
        ],
      });

      if (!module) {
        throw new Error("Module not found");
      }

      const plainModule = module.get({ plain: true });
      
      // Extract translation data and add it to the module object
      if (plainModule.translations && plainModule.translations.length > 0) {
        plainModule.module_name = plainModule.translations[0].module_name;
        plainModule.description = plainModule.translations[0].description;
      } else {
        // Default values if translation is not available
        plainModule.module_name = `[${plainModule.module_code}]`;
        plainModule.description = null;
      }
      
      // Remove the translations array from the returned object     
      return plainModule;
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
      // Extract translation data
      const { module_name, description, language = 'en', translations, module_name_vi, module_name_en, description_vi, description_en, ...moduleData } = updatedData;
      await sequelize.transaction(async (t) => {
        // Update the core module data
        if (Object.keys(moduleData).length > 0) {
          const [updated] = await Modules.update(moduleData, {
            where: { module_id: moduleId },
            transaction: t,
          });
          if (updated === 0) {
            throw new Error("Module not found");
          }
        }
        // Update or create the translation in the specified language (old API)
        if (module_name || description) {
          const [translation, created] = await ModuleTranslation.findOrCreate({
            where: { 
              module_id: moduleId,
              language 
            },
            defaults: {
              module_id: moduleId,
              language,
              module_name: module_name || '',
              description: description || null,
            },
            transaction: t,
          });
          if (!created) {
            await translation.update({
              ...(module_name && { module_name }),
              ...(description !== undefined && { description }),
            }, { transaction: t });
          }
        }
        // Handle multiple translations update (new API)
        if (translations && Array.isArray(translations)) {
          for (const translationData of translations) {
            const { language, module_name, description } = translationData;
            if (!language) continue;
            const [translation, created] = await ModuleTranslation.findOrCreate({
              where: { 
                module_id: moduleId,
                language 
              },
              defaults: {
                module_id: moduleId,
                language,
                module_name: module_name || '',
                description: description || null,
              },
              transaction: t,
            });
            if (!created) {
              await translation.update({
                ...(module_name && { module_name }),
                ...(description !== undefined && { description }),
              }, { transaction: t });
            }
          }
        }
        // Handle flat fields for vi/en (frontend compatibility)
        if (module_name_vi !== undefined || description_vi !== undefined) {
          const [viTrans, viCreated] = await ModuleTranslation.findOrCreate({
            where: { module_id: moduleId, language: 'vi' },
            defaults: {
              module_id: moduleId,
              language: 'vi',
              module_name: module_name_vi || '',
              description: description_vi || null,
            },
            transaction: t,
          });
          if (!viCreated) {
            await viTrans.update({
              ...(module_name_vi !== undefined && { module_name: module_name_vi }),
              ...(description_vi !== undefined && { description: description_vi }),
            }, { transaction: t });
          }
        }
        if (module_name_en !== undefined || description_en !== undefined) {
          const [enTrans, enCreated] = await ModuleTranslation.findOrCreate({
            where: { module_id: moduleId, language: 'en' },
            defaults: {
              module_id: moduleId,
              language: 'en',
              module_name: module_name_en || '',
              description: description_en || null,
            },
            transaction: t,
          });
          if (!enCreated) {
            await enTrans.update({
              ...(module_name_en !== undefined && { module_name: module_name_en }),
              ...(description_en !== undefined && { description: description_en }),
            }, { transaction: t });
          }
        }
      });
      // Get the updated module with translations
      return await this.getModuleWithTranslations(moduleId);
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
  },
  async deleteTranslation(moduleId: number, language: string) {
    try {
      const deleted = await ModuleTranslation.destroy({
        where: { 
          module_id: moduleId,
          language
        },
      });

      if (deleted === 0) {
        throw new Error("Translation not found");
      }

      logger.info(`Deleted module translation for language ${language} successfully`);
      return { message: "Module translation deleted successfully" };
    } catch (error) {
      logger.error("Error deleting module translation: " + error.message);
      throw new Error("Error deleting module translation: " + error.message);
    }
  },
};

export default moduleService;
