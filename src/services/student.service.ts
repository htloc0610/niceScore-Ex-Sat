import Student from "../models/student.model";
import Faculty from "../models/faculty.model";
import Status from "../models/status.model";

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
      console.log("faculty: ", faculties);
      return faculties;
    } catch (error) {
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
};

export default studentService;
