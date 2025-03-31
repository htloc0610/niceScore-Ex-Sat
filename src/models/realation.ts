import Faculty from "./faculty.model";
import Status from "./status.model";
import Identification from "./identification.model";
import Address from "./address.model";
import Course from "./course.model";
import Student from "./student.model";
import Configuration from "./configurations.model";
import StatusTransition from "./status_transitions.model";
import Module from "./modules.model";
import Class from "./classes.model";

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

  // Status - StatusTransition (current_status and new_status)
  Status.hasMany(StatusTransition, {
    foreignKey: "current_status",
    as: "currentStatusTransitions",
  });
  Status.hasMany(StatusTransition, {
    foreignKey: "new_status",
    as: "newStatusTransitions",
  });
  StatusTransition.belongsTo(Status, {
    foreignKey: "current_status",
    as: "currentStatus",
  });
  StatusTransition.belongsTo(Status, {
    foreignKey: "new_status",
    as: "newStatus",
  });

  // Module - Faculty
  Module.belongsTo(Faculty, { foreignKey: "faculty_id", as: "faculty" });
  Faculty.hasMany(Module, { foreignKey: "faculty_id", as: "modules" });

  // Module - Prerequisite
  Module.belongsTo(Module, { foreignKey: "prerequisite_id", as: "prerequisite" });
  Module.hasMany(Module, { foreignKey: "prerequisite_id", as: "dependentModules" });

  // Class - Module
  Class.belongsTo(Module, { foreignKey: "module_id", as: "module" });
  Module.hasMany(Class, { foreignKey: "module_id", as: "classes" });

  Configuration.sync();

  console.log("Database relation set up successfully!");
}
