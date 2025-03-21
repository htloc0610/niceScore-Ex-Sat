import Faculty from "./faculty.model";
import Status from "./status.model";
import Identification from "./identification.model";
import Address from "./address.model";
import Course from "./course.model";
import Student from "./student.model";

export default function setupRelation() {
  // Student - Faculty
  Student.belongsTo(Faculty, { foreignKey: "faculty_id", as: "faculty" });
  Faculty.hasMany(Student, { foreignKey: "faculty_id", as: "students" });

  // Student - Status
  Student.belongsTo(Status, { foreignKey: "status_id", as: "status" });
  Status.hasMany(Student, { foreignKey: "status_id", as: "students" });

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
  Student.belongsTo(Identification, {
    foreignKey: "identification_id",
    as: "identification",
  });
  Identification.hasMany(Student, {
    foreignKey: "identification_id",
    as: "students",
  });

  // Student - Course
  Student.belongsTo(Course, { foreignKey: "course_id", as: "course" });
  Course.hasMany(Student, { foreignKey: "course_id", as: "students" });

  console.log("Database relation set up successfully!");
}
