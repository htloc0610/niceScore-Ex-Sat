import { Request, Response } from "express";
import facultyService from "../services/faculty.service";
import { logger } from "../config/logger";

const facultyController = {
  getListFaculties: async (req: Request, res: Response): Promise<void> => {
    try {
      const faculties = await facultyService.getFaculties();
      logger.info("Successfully fetched faculties list");
      res.send({ message: "List of faculties", faculties });
    } catch (error) {
      logger.error("Error fetching faculties list");
      console.log("Error fetching faculties list:", error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching faculties." });
    }
  },
  getFacultyById: async (req: Request, res: Response): Promise<void> => {
    try {
      const facultyId = parseInt(req.params.id, 10);
      const faculty = await facultyService.getFacultyById(facultyId);
      if (!faculty) {
        logger.warn(`Faculty with ID ${facultyId} not found`);
        res.status(404).send({ message: "Faculty not found" });
        return;
      }
      res.send({ message: "Faculty found", faculty });
    } catch (error) {
      logger.error("Error fetching faculty by ID");
      console.log("Error fetching faculty by ID:", error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching the faculty." });
    }
  },

  addFaculty: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name_vi, name_en } = req.body;
      
      if (!name_vi || !name_en) {
        res.status(400).send({ message: "Both Vietnamese and English names are required" });
        return;
      }

      const newFaculty = await facultyService.addFaculty(name_vi, name_en);
      res
        .status(201)
        .send({ message: "Faculty added successfully", newFaculty });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the faculty." });
    }
  },  updateFaculty: async (req: Request, res: Response): Promise<void> => {
    try {
      const { faculty_id } = req.body;
      
      if (!faculty_id) {
        res.status(400).send({ message: "Faculty ID is required" });
        return;
      }
      
      const updatedData = req.body;
      const updatedFaculty = await facultyService.updateFaculty(
        faculty_id,
        updatedData
      );

      if (!updatedFaculty) {
        res
          .status(404)
          .send({ message: "Faculty not found or no changes made." });
      } else {
        res.status(200).send({
          message: "Faculty updated successfully",
          updatedFaculty,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the faculty." });
    }
  },
};

export default facultyController;
