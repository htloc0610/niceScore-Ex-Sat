import Course from "../models/course.model";
import { logger } from "../config/logger";

const courseService = {
  //get Courses
  async getAllCourses() {
    try {
      const courses = await Course.findAll({
        order: [["course_id", "ASC"]],
      });
      return courses.map(course => course.dataValues);
    } catch (error) {
      logger.error("Error fetching courses list", error);
      throw new Error("Error fetching courses list");
    }
  },
  //getCourses
  async getCourses() {
    try {
      logger.info("Fetching all courses");
      const courses = await Course.findAll();
      return courses;
    } catch (error) {
      logger.error("Error fetching courses list", error);
      throw new Error("Error fetching courses list");
    }
  },
  async addCourse(course_name_en: string, course_name_vi: string = '') {
    try {
      logger.info("Adding a new course", { course_name_en, course_name_vi });

      const newCourse = await Course.create({ 
        course_name_en, 
        course_name_vi: course_name_vi || course_name_en // Default to English name if Vietnamese is not provided
      });

      return newCourse.toJSON();
    } catch (error) {
      logger.error("Error adding new course: " + error.message);
      throw new Error("Error adding new course: " + error.message);
    }
  }, 
  //update course
  async updateCourse(courseId: number, courseData: any) {
    try {
      logger.info(`Updating course with ID: ${courseId}`);
      
      // Make sure we're using the correct field names
      const updateData = {
        course_name_en: courseData.course_name_en,
        course_name_vi: courseData.course_name_vi
      };
      
      const [updated] = await Course.update(updateData, {
        where: { course_id: courseId },
      });

      if (updated === 0) {
        logger.error(`Course with ID: ${courseId} not found`);
        throw new Error("Course not found");
      }
      const updatedCourse = await Course.findOne({
        where: { course_id: courseId },
      });
      logger.info(`Course with ID: ${courseId} updated successfully`);
      return updatedCourse ? updatedCourse.get() : null;
    } catch (error) {
      logger.error(`Error updating course with ID: ${courseId}`, error);
      throw new Error(error.message);
    }
  },
};

export default courseService;
