import { Request, Response } from "express";
import classRegistationService from "../services/class_registation.service";
import { logger } from "../config/logger";
import { log } from "winston";

const classRegistationController = {
  getClassRegistationList: async (req: Request, res: Response): Promise<void> => {
    try {
      const registrations = await classRegistationService.getAllRegistrations();
      logger.info("Successfully fetched class registration list");
      res.send({ message: "List of class registrations", registrations });
    } catch (error) {
      logger.error("Error fetching class registration list");
      console.error("Error fetching class registration list:", error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching class registrations." });
    }
  },

  addClassRegistation: async (req: Request, res: Response): Promise<void> => {
    try {
      const registrationData = req.body;

      if (!registrationData.student_id || !registrationData.class_id) {
        res.status(400).send({
          message: "Student ID and Class ID are required.",
        });
        return;
      }
      
      if (await classRegistationService.availableRegistration(registrationData)) {
        res.status(409).send({
          message: "This student is already registered for this class.",
        });
        return;
      }

      if(await classRegistationService.fullOfStudent(parseInt(registrationData.class_id))) {
        res.status(409).send({
          message: "This class is already full.",
        });
        return;
      }

      const createdRegistration = await classRegistationService.addRegistration(registrationData);

      res.status(201).send({
        message: "Class registration created successfully",
        createdRegistration,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while creating the class registration." });
    }
  },
  
  getClassRegistation: async (req: Request, res: Response): Promise<void> => {
    try {
      const registration_id = req.params.id; // Extract registration ID from URL params
      const registrationData = await classRegistationService.getRegistrationById(parseInt(registration_id));

      if (!registrationData) {
        res.status(404).send({ message: "Registration not found." });
      } else {
        res.status(200).send({ message: "Registration fetched successfully", registrationData });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the registration." });
    }
  },
  
  updateClassRegistation: async (req: Request, res: Response): Promise<void> => {
    try {
      const registration_id = req.params.id;
      const updatedData = req.body;

      if (!updatedData.student_id && !updatedData.class_id) {
        res.status(400).send({
          message: "At least one of Student ID or Class ID must be provided to update.",
        });
        return;
      }

      const updatedRegistration = await classRegistationService.updateRegistration(
        parseInt(registration_id),
        updatedData
      );

      if (!updatedRegistration) {
        res
          .status(404)
          .send({ message: "Registration not found or no changes made." });
      } else {
        res.status(200).send({
          message: "Registration updated successfully",
          updatedRegistration,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the registration." });
    }
  },
  
  deleteClassRegistation: async (req: Request, res: Response): Promise<void> => {
    try {
      const registration_id = req.params.id;

      const { reason } = req.body;

      if (!reason) {
        res.status(400).send({
          message: "Reason for cancellation is required.",
        });
        return;
      }

      const deleted = await classRegistationService.deleteRegistration(parseInt(registration_id), reason);

      if (!deleted) {
        res.status(404).send({ message: "Registration not found." });
      } else {
        res.status(200).send({ message: "Registration deleted successfully." });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while deleting the registration." });
    }
  }
};

export default classRegistationController;
