import Student from "../models/student.model";
import Faculty from "../models/faculty.model";
import Course from "../models/course.model";
import Address from "../models/address.model";
import Status from "../models/status.model";
import Identification from "../models/identification.model";

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
      throw new Error("Error fetching students list: " + error.message);
    }
  },
  // Get list of faculties
  async getFaculties() {
    try {
      const faculties = await Faculty.findAll();
      return faculties;
    } catch (error) {
      throw new Error("Error fetching faculties list");
    }
  },

  // Add a new student
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
      throw new Error("Error adding new student" + error);
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
      throw new Error(error.message);
    }
  },
};

export default studentService;
