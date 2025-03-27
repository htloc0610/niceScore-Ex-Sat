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
  addFaculty: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      console.log(data.name, "data name");
      const newFaculty = await facultyService.addFaculty(data.name);
      res
        .status(201)
        .send({ message: "Faculty added successfully", newFaculty });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the faculty." });
    }
  },
  updateFaculty: async (req: Request, res: Response): Promise<void> => {
    try {
      const { faculty_id, name } = req.body;
      const updatedData = req.body;
      console.log(updatedData, "id", faculty_id);
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
