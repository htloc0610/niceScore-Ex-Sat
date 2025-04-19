import { Request, Response } from "express";
import classService from "../services/class.service";
import { logger } from "../config/logger";

const classController = {
  getListClasses: async (req: Request, res: Response): Promise<void> => {
    try {
      const classes = await classService.getAllClasses();
      logger.info("Successfully fetched classes list");
      res.send({ message: "List of classes", classes });
    } catch (error) {
      logger.error("Error fetching classes list");
      console.error("Error fetching classes list:", error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching classes." });
    }
  },
  addClass: async (req: Request, res: Response): Promise<void> => {
    try {
      const newClassData = req.body;

      if (!newClassData.class_name || !newClassData.instructor) {
      res.status(400).send({
        message: "Class name and instructor are required.",
      });
      return;
      }

      if (!await classService.isActive(newClassData.module_id)) {
        res.status(400).send({
          message: "The module is deactivated.",
        });
        return;
      }

      const createdClass = await classService.createClass(newClassData);

      res.status(201).send({
      message: "Class created successfully",
      createdClass,
      });
    } catch (error) {
      console.error(error);
      res
      .status(500)
      .send({ message: "An error occurred while creating the class." });
    }
  },
  getClass: async (req: Request, res: Response): Promise<void> => {
    try {
      const class_id = req.params.id; // Extract class ID from URL params
      const classData = await classService.getClassById(parseInt(class_id));

      if (!classData) {
        res.status(404).send({ message: "Class not found." });
      } else {
        res.status(200).send({ message: "Class fetched successfully", classData });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the class." });
    }
  },
  updateClass: async (req: Request, res: Response): Promise<void> => {
    try {
      const class_id = req.params.id;
      const updatedData = req.body;

      if (updatedData.class_code) {
        res.status(400).send({
          message: "Cannot change class code after creation.",
        });
        return;
      }

      const updatedClass = await classService.updateClass(parseInt(class_id), updatedData);

      if (!updatedClass) {
        res
          .status(404)
          .send({ message: "Class not found or no changes made." });
      } else {
        res.status(200).send({
          message: "Class updated successfully",
          updatedClass,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the class." });
    }
  },
  deleteClass: async (req: Request, res: Response): Promise<void> => {
    try {
      const class_id = req.params.id;

      const deletedClass = await classService.deleteClass(parseInt(class_id));

      if (!deletedClass) {
        res.status(404).send({ message: "Class not found." });
      } else {
        res.status(200).send({
          message: "Class deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while deleting the class." });
    }
  },

  getClassByModuleId: async (req: Request, res: Response): Promise<void> => {
    try {
      const module_id = req.params.id; // Extract module ID from URL params
      const classes = await classService.getClassByModuleId(parseInt(module_id));

      if (!classes) {
        res.status(404).send({ message: "Classes not found." });
      } else {
        res.status(200).send({ message: "Classes fetched successfully", classes });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the classes." });
    }
  },
};

export default classController;
