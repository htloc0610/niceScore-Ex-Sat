import { Request, Response } from "express";
import courseService from "../services/course.service";
import { logger } from "../config/logger";

const studentController = {
  getListCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const courses = await courseService.getCourses();
      logger.info("Courses fetched successfully");
      res.send({ message: "List of courses", courses });
    } catch (error) {
      console.error(error);
      logger.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching courses." });
    }
  },
  //add course
  addCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const newCourse = await courseService.addCourse(data);
      logger.info("Course added successfully");
      res.status(201).send({ message: "Course added successfully", newCourse });
    } catch (error) {
      console.error(error);
      logger.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the course." });
    }
  },
  //update course
  updateCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const { course_id, name } = req.body;
      const updatedData = req.body;
      const updatedCourse = await courseService.updateCourse(
        course_id,
        updatedData
      );

      if (!updatedCourse) {
        logger.error("Course not found or no changes made");
        res
          .status(404)
          .send({ message: "Course not found or no changes made." });
      } else {
        logger.info("Course updated successfully");
        res.status(200).send({
          message: "Course updated successfully",
          updatedCourse,
        });
      }
    } catch (error) {
      console.error(error);
      logger.error(error);
      res
        .status(500)
        .send({ message: "An error occurred while updating the course." });
    }
  },
};

export default studentController;
