import { Request, Response } from "express";
import moduleService from "../services/module.service";
import { logger } from "../config/logger";

const facultyController = {  getListModules: async (req: Request, res: Response): Promise<void> => {
    try {
      // Get language from query parameter, defaulting to English
      const language = req.query.language as string || 'en';
      
      const modules = await moduleService.getAllModules(language);
      logger.info(`Successfully fetched modules list in ${language} language`);
      res.send({ message: "List of modules", modules });
    } catch (error) {
      logger.error("Error fetching modules list");
      console.log("Error fetching modules list:", error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching modules." });
    }
  },
  addModule: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;

      const { credits } = data;
      if (credits < 2) {
        res.status(400).send({
          message: "Credits must be at least 2.",
        });
        return;
      }
      
      const newModule = await moduleService.addModule(data);
      res
        .status(201)
        .send({ message: "Module added successfully", newModule });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the module." });
    }
  },  getModule: async (req: Request, res: Response): Promise<void> => {
    try {
      const module_id = req.params.id; // Extract module ID from URL params
      const language = req.query.language as string || 'en';
      
      // Check if translations parameter is provided and true
      const includeTranslations = req.query.translations === 'true';
      
      let module;
      if (includeTranslations) {
        module = await moduleService.getModuleWithTranslations(parseInt(module_id));
      } else {
        module = await moduleService.getModuleById(parseInt(module_id), language);
      }

      if (!module) {
        res.status(404).send({ message: "Module not found." });
      } else {
        res.status(200).send({ message: "Module fetched successfully", module });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the module." });
    }
  },
  updateModule: async (req: Request, res: Response): Promise<void> => {
    try {
      const module_id = req.params.id;
      const updatedData = req.body;

      if (updatedData.module_code) {
        res.status(400).send({
          message: "Cannot change course code after creation.",
        });
        return;
      }

      if(updatedData.credits && await moduleService.hasRegisterStudent(parseInt(module_id))) {
        res.status(400).send({
          message: "Module cannot be updated because it has registered students.",
        });
        return;
      }

      const updatedModule = await moduleService.updateModule(parseInt(module_id), updatedData);

      if (!updatedModule) {
        res
          .status(404)
          .send({ message: "Module not found or no changes made." });
      } else {
        res.status(200).send({
          message: "Module updated successfully",
          updatedModule,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the module." });
    }
  },
  deleteModule: async (req: Request, res: Response): Promise<void> => {
    try {
      const module_id = req.params.id;

      if (await moduleService.isModuleOlderThan30Minutes(parseInt(module_id))) {
        res.status(400).send({
          message: "Module cannot be deleted after 30 minutes of creation.",
        });
        return;
      }
      
      if (await moduleService.hasLinkedClasses(parseInt(module_id))) {
        res.status(400).send({
          message: "Module cannot be deleted because it has linked classes.",
        });
        return;
      }

      const deletedModule = await moduleService.deleteModule(parseInt(module_id));

      if (!deletedModule) {
        res.status(404).send({ message: "Module not found." });
      } else {
        res.status(200).send({ message: "Module deleted successfully." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while deleting the module." });
    }
  },
  getModuleWithTranslations: async (req: Request, res: Response): Promise<void> => {
    try {
      const module_id = req.params.id; // Extract module ID from URL params
      const module = await moduleService.getModuleWithTranslations(parseInt(module_id));

      if (!module) {
        res.status(404).send({ message: "Module not found." });
      } else {
        res.status(200).send({ message: "Module with translations fetched successfully", module });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the module with translations." });
    }
  },
  
  addModuleTranslation: async (req: Request, res: Response): Promise<void> => {
    try {
      const module_id = req.params.id;
      const translationData = req.body;

      if (!translationData.language || !translationData.module_name) {
        res.status(400).send({
          message: "Language and module name are required for translation.",
        });
        return;
      }

      const updatedModule = await moduleService.updateModule(parseInt(module_id), {
        translations: [translationData]
      });

      res.status(200).send({
        message: "Module translation added successfully",
        module: updatedModule,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the module translation." });
    }
  },
  
  deleteModuleTranslation: async (req: Request, res: Response): Promise<void> => {
    try {
      const module_id = req.params.id;
      const language = req.params.language;

      if (!language) {
        res.status(400).send({
          message: "Language parameter is required.",
        });
        return;
      }

      await moduleService.deleteTranslation(parseInt(module_id), language);

      res.status(200).send({
        message: `Module translation for language '${language}' deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while deleting the module translation." });
    }
  },
  getModuleWithLanguage: async (req: Request, res: Response): Promise<void> => {
    try {
      const module_id = req.params.id;
      // Get the language from URL parameter, default to English if not provided
      const language = req.params.language || 'en';
      
      // Use the existing getModuleById method with language parameter
      const module = await moduleService.getModuleById(parseInt(module_id), language);

      if (!module) {
        res.status(404).send({ message: "Module not found." });
      } else {
        res.status(200).send({ 
          message: `Module fetched successfully in ${language} language`, 
          module 
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the module translation." });
    }
  },
  
  addModuleLanguageTranslation: async (req: Request, res: Response): Promise<void> => {
    try {
      const module_id = req.params.id;
      const language = req.params.language || 'en';
      const { module_name, description } = req.body;

      if (!module_name) {
        res.status(400).send({
          message: "Module name is required for translation.",
        });
        return;
      }

      // Create a translation object with the language from URL parameter
      const translationData = {
        language,
        module_name,
        description
      };

      const updatedModule = await moduleService.updateModule(parseInt(module_id), {
        translations: [translationData]
      });

      res.status(200).send({
        message: `Module translation for ${language} added successfully`,
        module: updatedModule,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the module translation." });
    }
  },
};

export default facultyController;
