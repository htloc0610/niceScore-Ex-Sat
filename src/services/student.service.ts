import Student from "../models/student.model";
import Faculty from "../models/faculty.model";
import Course from "../models/course.model";
import Address from "../models/address.model";
import Status from "../models/status.model";
import Transcript from "../models/transcripts.model";
import Module from "../models/modules.model";
import Class from "../models/classes.model";
import Identification from "../models/identification.model";
import addressService from "./address.service";
import identificationService from "./identification.service";
import { logger } from "../config/logger";

const studentService = {
  // Get list of students with related data
  async getListStudent() {
    try {
      const students = await Student.findAll({
        attributes: {
          exclude: [
            "status_id",
            "faculty_id",
            "course_id",
            "permanent_address_id",
            "temporary_address_id",
            "mailing_address_id",
            "identification_id",
          ],
        },
        include: [          {
            model: Faculty,
            as: "faculty",
            attributes: ["name_vi", "name_en"], // Get faculty names in both languages
          },          {
            model: Course,
            as: "course",
            attributes: ["course_name_en", "course_name_vi"], // Get course names in both languages
          },
          {
            model: Status,
            as: "status",
            attributes: ["name"], // Lấy trạng thái sinh viên
          },
          {
            model: Address,
            as: "permanentAddress",
            attributes: [
              "house_number",
              "street_name",
              "ward",
              "district",
              "city",
              "country",
            ], // Địa chỉ thường trú
          },
          {
            model: Address,
            as: "temporaryAddress",
            attributes: [
              "house_number",
              "street_name",
              "ward",
              "district",
              "city",
              "country",
            ], // Địa chỉ tạm trú
          },
          {
            model: Address,
            as: "mailingAddress",
            attributes: [
              "house_number",
              "street_name",
              "ward",
              "district",
              "city",
              "country",
            ], // Địa chỉ nhận thư
          },
          {
            model: Identification,
            as: "identification",
            attributes: [
              "type",
              "number",
              "issue_date",
              "expiry_date",
              "place_of_issue",
              "country_of_issue",
              "has_chip",
              "notes",
            ], // Thông tin căn cước công dân
          },
        ],
        order: [["student_id", "asc"]], // Sắp xếp theo id tăng dần
      });
      return students;
    } catch (error) {
      logger.error("Error fetching students list: " + error.message);
      console.log("Error fetching students list:", error);
      throw new Error("Error fetching students list: " + error.message);
    }
  },
  // Add a new student
  async addStudent(data: any) {
    try {
      // Tạo promises để thêm địa chỉ thường trú, tạm trú, nhận thư
      const permanentAddressPromise = addressService.addAddress(data.permanent);
      const temporaryAddressPromise = addressService.addAddress(data.temporary);
      const mailingAddressPromise = addressService.addAddress(data.mailing);

      // Tạo promise để thêm giấy tờ tùy thân
      const identificationPromise = identificationService.addIdentification({
        type: data.type,
        number: data.number,
        issue_date: data.issue_date,
        expiry_date: data.expiry_date,
        place_of_issue: data.place_of_issue,
        country_of_issue: data.country_of_issue,
        has_chip: data.has_chip || false,
        notes: data.notes || "",
      });
      // Chạy tất cả promises cùng lúc
      const [
        permanentAddress,
        temporaryAddress,
        mailingAddress,
        identification,
      ] = await Promise.all([
        permanentAddressPromise,
        temporaryAddressPromise,
        mailingAddressPromise,
        identificationPromise,
      ]);

      // Sau khi đã có tất cả địa chỉ và giấy tờ, thêm sinh viên
      const newStudent = await Student.create({
        student_id: data.student_id,
        full_name: data.full_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        faculty_id: data.faculty_id,
        course_id: data.course_id,
        program: data.program,
        status_id: data.status_id,
        nationality: data.nationality,
        email: data.email,
        phone_number: data.phone_number,
        permanent_address_id: permanentAddress.address_id,
        temporary_address_id: temporaryAddress.address_id,
        mailing_address_id: mailingAddress.address_id,
        identification_id: identification.identification_id,
      });

      return newStudent;
    } catch (error) {
      logger.error("Error adding student: " + error.message);
      console.error("Error adding student:", error);
      throw error;
    }
  },

  // Delete a student by ID
  async deleteStudent(studentId: number) {
    try {
      const result = await Student.destroy({
        where: { student_id: studentId },
      });
      if (result === 0) {
        throw new Error("Student not found");
      }
      return result;
    } catch (error) {
      throw new Error("Error deleting student");
    }
  },

  // Update a student by ID
  async updateStudent(studentId: number, studentData: any) {
    try {
      const student = Student.build(studentData);
      await student.validate();
      const [updated] = await Student.update(studentData, {
        where: { student_id: studentId },
      });

      if (updated === 0) {
        throw new Error("Student not found");
      }
      const updatedStudent = await Student.findOne({
        where: { student_id: studentId },
      });
      return updatedStudent ? updatedStudent.get() : null;
    } catch (error) {
      logger.error("Error updating student: " + error.message);
      console.log("Error updating student:", error);
      throw new Error(error.message);
    }
  },
  // Add a new student from JSON data
  async addJson(studentJson: object) {
    try {
      const studentData = studentJson as any;
      // Create related entities first
      const faculty = await Faculty.findOrCreate({
        where: { name_en: studentData.faculty.name_en || studentData.faculty.name },
        defaults: {
          name_en: studentData.faculty.name_en || studentData.faculty.name,
          name_vi: studentData.faculty.name_vi || studentData.faculty.name
        }
      });
      const course = await Course.findOrCreate({
        where: { course_name_en: studentData.course.course_name_en || studentData.course.course_name },
        defaults: {
          course_name_en: studentData.course.course_name_en || studentData.course.course_name,
          course_name_vi: studentData.course.course_name_vi || studentData.course.course_name
        }
      });
      const status = await Status.findOrCreate({
        where: { name_vi: studentData.status.name_vi || studentData.status.name },
        defaults: { 
          name_vi: studentData.status.name_vi || studentData.status.name, 
          name_en: studentData.status.name_en || studentData.status.name 
        },
      });

      const permanentAddress = await addressService.addAddress(
        studentData.permanentAddress
      );

      const temporaryAddress = await addressService.addAddress(
        studentData.temporaryAddress
      );

      const mailingAddress = await addressService.addAddress(
        studentData.mailingAddress
      );

      const identification = await identificationService.addIdentification(
        studentData.identification
      );

      // Assign the IDs of the related entities to the student data
      studentData.faculty_id = faculty[0].faculty_id;
      studentData.course_id = course[0].course_id;
      studentData.status_id = status[0].status_id;
      studentData.permanent_address_id = permanentAddress.address_id;
      studentData.temporary_address_id = temporaryAddress.address_id;
      studentData.mailing_address_id = mailingAddress.address_id;
      studentData.identification_id = identification.identification_id;

      // Create the student
      const newStudent = await Student.create(studentData);
      return newStudent;
    } catch (error) {
      logger.error("Error adding student from JSON: " + error.message);
      console.log("Error adding student from JSON:", error);
      throw new Error("Error adding student from JSON: " + error.message);
    }
  },
  // Add a new student from Excel data
  async addExcel(studentExcel: object) {
    try {
      const studentData = studentExcel as any;
      // Create related entities first
      const faculty = await Faculty.findOrCreate({
        where: { name_en: studentData.faculty.name_en},
        defaults: {
          name_en: studentData.faculty.name_en ,
          name_vi: studentData.faculty.name_vi ,
        }
      });
      const course = await Course.findOrCreate({
        where: { course_name_en: studentData.course.course_name_en},
        defaults: {
          course_name_en: studentData.course.course_name_en,
          course_name_vi: studentData.course.course_name_vi,
        }
      });
      const status = await Status.findOrCreate({
        where: { name_vi: studentData.status.name_vi},
        defaults: { 
          name_vi: studentData.status.name_vi,
          name_en: studentData.status.name_en,
        },
      });

      const permanentAddress = await addressService.addAddress(
        studentData.permanentAddress
      );

      const temporaryAddress = await addressService.addAddress(
        studentData.temporaryAddress
      );

      const mailingAddress = await addressService.addAddress(
        studentData.mailingAddress
      );

      const identification = await identificationService.addIdentification(
        studentData.identification
      );

      // Assign the IDs of the related entities to the student data
      studentData.faculty_id = faculty[0].faculty_id;
      studentData.course_id = course[0].course_id;
      studentData.status_id = status[0].status_id;
      studentData.permanent_address_id = permanentAddress.address_id;
      studentData.temporary_address_id = temporaryAddress.address_id;
      studentData.mailing_address_id = mailingAddress.address_id;
      studentData.identification_id =
        identification.dataValues.identification_id;

      // Remove unnecessary fields
      delete studentData.faculty;
      delete studentData.course;
      delete studentData.status;
      delete studentData.permanentAddress;
      delete studentData.temporaryAddress;
      delete studentData.mailingAddress;
      delete studentData.identification;
      // Create the student
      const newStudent = await Student.create(studentData);

      return newStudent;
    } catch (error) {
      logger.error("Error adding student from Excel: " + error.message);
      console.log("Error adding student from Excel:", error);
      throw new Error("Error adding student from Excel: " + error.message);
    }
  },
  async getFacultyName(faculty_id: string) {
    const faculty = await Faculty.findOne({ where: { faculty_id } });
    return faculty;
  },
  async getStudentById(studentId: number) {
    try {
      const student = await Student.findOne({
        where: { student_id: studentId },
        include: [
          {
            model: Faculty,
            as: "faculty",
          },
          {
            model: Course,
            as: "course",
          },
          {
            model: Status,
            as: "status",
          },
          {
            model: Address,
            as: "permanentAddress",
          },
          {
            model: Address,
            as: "temporaryAddress",
          },
          {
            model: Address,
            as: "mailingAddress",
          },
          {
            model: Identification,
            as: "identification",
          },
        ],
      });
      return student;
    } catch (error) {
      throw new Error("Error fetching student by id");
    }
  },

  //updateStudentById
  async updateStudentById(studentId: number, studentData: any) {
    try {
      //updateAddress: async (addressId: number, addressData:
      const permanentAddress = await addressService.updateAddress(
        studentData.permanentAddress.permanent_address_id,
        studentData.permanentAddress
      );

      const temporaryAddress = await addressService.updateAddress(
        studentData.temporaryAddress.temporary_address_id,
        studentData.temporaryAddress
      );

      const mailingAddress = await addressService.updateAddress(
        studentData.mailingAddress.mailing_address_id,
        studentData.mailingAddress
      );

      const identification = await identificationService.updateIdentification(
        studentData.identification.identification_id,
        studentData.identification
      );

      // Assign the IDs of the related entities to the student data
      studentData.permanent_address_id = permanentAddress.address_id;
      studentData.temporary_address_id = temporaryAddress.address_id;
      studentData.mailing_address_id = mailingAddress.address_id;
      studentData.identification_id = identification.identification_id;

      // Remove unnecessary fields
      delete studentData.faculty;
      delete studentData.course;
      delete studentData.status;
      delete studentData.permanentAddress;
      delete studentData.temporaryAddress;
      delete studentData.mailingAddress;
      delete studentData.identification;

      studentData.status_id = parseInt(studentData.status_id, 10);
      console.log("studentData", studentData);

      // Update the student
      const [updated] = await Student.update(studentData, {
        where: { student_id: studentId },
      });

      if (updated === 0) {
        throw new Error("Student not found");
      }
      const updatedStudent = await Student.findOne({
        where: { student_id: studentId },
      });
      return updatedStudent ? updatedStudent.get() : null;
    } catch (error) {
      logger.error("Error updating student: " + error.message);
      console.log("Error updating student:", error);
      throw new Error(error.message);
    }
  },
  async getStudentStatus(studentId: number) {
    try {
      const student = await Student.findOne({
        where: { student_id: studentId },
        include: [
          {
            model: Status,
            as: "status",
            attributes: ["status_id"],
          },
        ],
      });

      if (!student) {
        throw new Error("Student not found");
      }

      return student.dataValues.status.status_id;
    } catch (error) {
      logger.error("Error fetching student status: " + error.message);
      console.log("Error fetching student status:", error);
      throw new Error("Error fetching student status: " + error.message);
    }
  },

  async getStudentGrades(studentId: number) {
  try {
    const grades = await Transcript.findAll({
      where: { student_id: studentId },
      include: [
        {
          model: Class,
          as: "class", // Ensure this matches the alias set in the association
          include: [
            {
              model: Module,
              as: "module", // Ensure 'module' alias is correct
              attributes: ["module_code", "module_name", "credits"],
            },
          ],
          attributes: ["class_name"],
        },
      ],
      attributes: ["grade"],
    });

    if (!grades || grades.length === 0) {
      throw new Error("No grades found for the student");
    }

    // Map the result to return the desired format
    const formattedGrades = grades.map((item) => {
      const plainItem = item.get({ plain: true }); // Convert Sequelize instance to plain object
      console.log(plainItem )
      return {
        grade: plainItem.grade,
        transcript_id: plainItem.transcript_id, // Accessing class_name from the related Class model
        module_name: plainItem.class.module.module_name, // Accessing module_name from the related Module model
        module_code: plainItem.class.module.module_code, // Accessing module_code from the related Module model
        credits: plainItem.class.module.credits, // Accessing credits from the related Module model
      };
    });

    console.log(formattedGrades); // You can log the formatted result if needed
    return formattedGrades; // Return the formatted grades array
  } catch (error) {
    logger.error("Error fetching student grades: " + error.message);
    console.log("Error fetching student grades:", error);
    throw new Error("Error fetching student grades: " + error.message);
  }
}

};

export default studentService;
