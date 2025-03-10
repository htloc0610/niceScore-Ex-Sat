import Student from "../models/student.model";

const studentService = {
  // Get list of students
  async getList() {
    try {
      const students = await Student.findAll();
      return students;
    } catch (error) {
      throw new Error("Error fetching students list");
    }
  },

  // Add a new student
  async add(studentData: any) {
    try {
      const newStudent = await Student.create(studentData);
      return newStudent;
    } catch (error) {
      throw new Error("Error adding new student");
    }
  },

  // Delete a student by ID
  async delete(studentId: number) {
    try {
      const result = await Student.destroy({ where: { id: studentId } });
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
        where: { id: studentId },
      });
      if (updated === 0) {
        throw new Error("Student not found");
      }
      const updatedStudent = await Student.findOne({
        where: { id: studentId },
      });
      return updatedStudent;
    } catch (error) {
      throw new Error("Error updating student");
    }
  },
};

export default studentService;
