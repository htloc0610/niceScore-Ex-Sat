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

      if (!newClassData.name || !newClassData.teacher) {
      res.status(400).send({
        message: "Class name and teacher are required.",
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
          deletedClass,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while deleting the class." });
    }
  }
};

export default classController;
