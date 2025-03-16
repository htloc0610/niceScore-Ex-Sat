import Student from "./student.model";
import Faculty from "./faculty.model";
import Status from "./status.model";
import Identification from "./identification.model";
import Address from "./address.model";
import Course from "./course.model";

export default function setupRelation() {
  // Student - Faculty
  Student.belongsTo(Faculty, { foreignKey: "faculty_id" });
  Faculty.hasMany(Student, { foreignKey: "faculty_id" });

  // Student - Status
  Student.belongsTo(Status, { foreignKey: "status_id" });
  Status.hasMany(Student, { foreignKey: "status_id" });

  // Student - Address (permanent, temporary, mailing)
  Student.belongsTo(Address, {
    foreignKey: "permanent_address_id",
    as: "permanentAddress",
  });
  Student.belongsTo(Address, {
    foreignKey: "temporary_address_id",
    as: "temporaryAddress",
  });
  Student.belongsTo(Address, {
    foreignKey: "mailing_address_id",
    as: "mailingAddress",
  });

  // Address - Student (Mỗi địa chỉ có thể thuộc nhiều sinh viên)
  Address.hasMany(Student, {
    foreignKey: "permanent_address_id",
    as: "permanentResidents",
  });
  Address.hasMany(Student, {
    foreignKey: "temporary_address_id",
    as: "temporaryResidents",
  });
  Address.hasMany(Student, {
    foreignKey: "mailing_address_id",
    as: "mailingResidents",
  });

  // Student - Identification
  Student.belongsTo(Identification, { foreignKey: "identification_id" });
  Identification.hasMany(Student, { foreignKey: "identification_id" });

  // Student - Course
  Student.belongsTo(Course, { foreignKey: "course_id" });
  Course.hasMany(Student, { foreignKey: "course_id" });

  console.log("Database relation set up successfully!");
}
