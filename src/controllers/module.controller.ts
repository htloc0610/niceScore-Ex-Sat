import { Request, Response } from "express";
import moduleService from "../services/module.service";
import { logger } from "../config/logger";

const facultyController = {
  getListModules: async (req: Request, res: Response): Promise<void> => {
    try {
      const modules = await moduleService.getAllModules();
      logger.info("Successfully fetched modules list");
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
  },
  getModule: async (req: Request, res: Response): Promise<void> => {
    try {
      const module_id = req.params.id; // Extract module ID from URL params
      const module = await moduleService.getModuleById(parseInt(module_id));

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
      const module_id = req.params.id; // Extract module ID from URL params
      const updatedData = req.body;
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
};

export default facultyController;
