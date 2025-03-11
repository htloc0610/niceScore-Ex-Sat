import Student from "../models/student.model";
import Faculty from "../models/faculty.model";

const studentService = {
  // Get list of students
  async getList() {
    try {
      const students = await Student.findAll();
      const studentsWithFaculty = await Promise.all(
        students.map(async (student) => {
          const faculty = await Faculty.findOne({
            where: { faculty_id: student.faculty_id },
          });
          return {
            ...student.toJSON(),
            facultyName: faculty ? faculty.name : null,
          };
        })
      );
      return studentsWithFaculty;
    } catch (error) {
      throw new Error("Error fetching students list");
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
      const result = await Student.destroy({ where: { student_id: studentId } });
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
      throw new Error("Error updating student");
    }
  },
};

export default studentService;
