import Student from "../models/student.model";
import Faculty from "../models/faculty.model";
import Course from "../models/course.model";
import Address from "../models/address.model";
import Status from "../models/status.model";
import Identification from "../models/identification.model";
import addressService from "./address.service";
import identificationService from "./identification.service";
import {logger} from "../config/logger";

const studentService = {
  // Get list of students with related data
  async getList() {
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
        include: [
          {
            model: Faculty,
            as: "faculty",
            attributes: ["name"], // Lấy tên khoa
          },
          {
            model: Course,
            as: "course",
            attributes: ["course_name"], // Lấy thông tin khóa học
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
  // Get list of faculties
  async getFaculties() {
    try {
      const faculties = await Faculty.findAll();
      console.log("faculty: ", faculties);
      return faculties;
    } catch (error) {
      logger.error("Error fetching faculties list");
      throw new Error("Error fetching faculties list");
    }
  },

  
  // Get list of status
  async getStatus() {
    try {
      const status = await Status.findAll();
      return status;
    } catch (error) {
      throw new Error("Error fetching status list");
    }
  },

  // Add a new student 
  /*
  async addStudent(data: any) {
    try {
      const newStudent = await Student.create(data);
      const faculty = await Faculty.findOne({
        where: { faculty_id: newStudent.faculty_id },
      });
      return {
        ...newStudent.toJSON(),
        facultyName: faculty ? faculty.name : null,
      };
    } catch (error) {
      logger.error("Error adding new student" + error);
      console.log("Error adding new student:", error);  
      throw new Error("Error adding new student" + error);
    }
  },
  */
  async addStudent(data: any) {
      try {
        console.log(data);
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
        console.log( data.type,
          data.number,
          "issue_date" ,data.issue_date,
          "expiry_date", data.expiry_date,
          "place_of_issue", data.place_of_issue,
          "country_of_issue", data.country_of_issue,
          "has_chip", data.has_chip || false,
          "notes", data.notes || "");
    
        // Chạy tất cả promises cùng lúc
        const [permanentAddress, temporaryAddress, mailingAddress, identification] = await Promise.all([
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
  async delete(studentId: number) {
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
  async update(studentId: number, studentData: any) {
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
        where: { name: studentData.faculty.name },
      });
      const course = await Course.findOrCreate({
        where: { course_name: studentData.course.course_name },
      });
      const status = await Status.findOrCreate({
        where: { name: studentData.status.name },
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
        where: { name: studentData.faculty.name },
      });
      const course = await Course.findOrCreate({
        where: { course_name: studentData.course.course_name },
      });
      const status = await Status.findOrCreate({
        where: { name: studentData.status.name },
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

  async addFaculty(data: any) {
    try {
      const newFaculty = await Faculty.create(data);
     
      return {
        ...newFaculty.toJSON(),
      };
    } catch (error) {
      throw new Error("Error adding new faculty" + error);
    }
  },

  async updateFaculty(facultyId: number, facultyData: any) {
    try {
      
      const [updated] = await Faculty.update(facultyData, {
        where: { faculty_id: facultyId },
      });
      
      if (updated === 0) {
        throw new Error("Faculty not found");
      }
      const updatedFaculty = await Faculty.findOne({
        where: { faculty_id: facultyId },
      });
  return updatedFaculty ? updatedFaculty.get() : null;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async addStatus(data: any) {
    try {
      const newStatus = await Status.create(data);
     
      return {
        ...newStatus.toJSON(),
      };
    } catch (error) {
      throw new Error("Error adding new status" + error);
    }
  },

  async updateStatus(statusId: number, statusData: any) {
    try {
      
      const [updated] = await Status.update(statusData, {
        where: { status_id: statusId },
      });
      
      if (updated === 0) {
        throw new Error("Status not found");
      }
      const updatedStatus = await Status.findOne({
        where: { status_id: statusId },
      });
  return updatedStatus ? updatedStatus.get() : null;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  //add course
  async addCourse(data: any) {
    try {
      const newCourse = await Course.create(data);
     
      return {
        ...newCourse.toJSON(),
      };
    } catch (error) {
      throw new Error("Error adding new course" + error);
    }
  },

  //update course
  async updateCourse(courseId: number, courseData: any) {
    try {
      
      const [updated] = await Course.update(courseData, {
        where: { course_id: courseId },
      });
      
      if (updated === 0) {
        throw new Error("Course not found");
      }
      const updatedCourse = await Course.findOne({
        where: { course_id: courseId },
      });
  return updatedCourse ? updatedCourse.get() : null;
    }
    catch (error) {
      throw new Error(error.message);
    }
  },

  //getCourses
  async getCourses() {
    try {
      const courses = await Course.findAll();
      return courses;
    } catch (error) {
      throw new Error("Error fetching courses list");
    }
  },

  //getStudentById
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
            studentData.permanentAddress.permanent_address_id ,studentData.permanentAddress
        );

        const temporaryAddress = await addressService.updateAddress(
          studentData.temporaryAddress.temporary_address_id,studentData.temporaryAddress
        );

        const mailingAddress = await addressService.updateAddress(
            studentData.mailingAddress.mailing_address_id,studentData.mailingAddress
        );

        const identification = await identificationService.updateIdentification(
            studentData.identification.identification_id,studentData.identification
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
};

export default studentService;
