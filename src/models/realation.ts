import Faculty from "./faculty.model";
import Status from "./status.model";
import Identification from "./identification.model";
import Address from "./address.model";
import Course from "./course.model";
import Student from "./student.model";
import Configuration from "./configurations.model";
import StatusTransition from "./status_transitions.model";
import Module from "./modules.model";
import ModuleTranslation from "./module_translations.model";
import Class from "./classes.model";
import ClassRegistration from "./class_registrations.model";
import RegistrationCancellation from "./registration_cancellations.model"; 
import Transcript from "./transcripts.model";

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

  // ClassRegistration - Student - Class
  ClassRegistration.belongsTo(Student, { foreignKey: "student_id", as: "student" });
  Student.hasMany(ClassRegistration, { foreignKey: "student_id", as: "classRegistrations" });

  ClassRegistration.belongsTo(Class, { foreignKey: "class_id", as: "class" });
  Class.hasMany(ClassRegistration, { foreignKey: "class_id", as: "registrations" });

  // RegistrationCancellation - Student - Class
  RegistrationCancellation.belongsTo(Student, { foreignKey: "student_id", as: "student" });
  Student.hasMany(RegistrationCancellation, { foreignKey: "student_id", as: "registrationCancellations" });

  RegistrationCancellation.belongsTo(Class, { foreignKey: "class_id", as: "class" });
  Class.hasMany(RegistrationCancellation, { foreignKey: "class_id", as: "cancellations" });

  // Transcript - Student - Class
  Transcript.belongsTo(Student, { foreignKey: "student_id", as: "student" });
  Student.hasMany(Transcript, { foreignKey: "student_id", as: "transcripts" });

  Transcript.belongsTo(Class, { foreignKey: "class_id", as: "class" });
  Class.hasMany(Transcript, { foreignKey: "class_id", as: "transcripts" });

  // Module - ModuleTranslation (for multilanguage support)
  Module.hasMany(ModuleTranslation, { foreignKey: "module_id", as: "translations" });
  ModuleTranslation.belongsTo(Module, { foreignKey: "module_id", as: "module" });

  Configuration.sync();

  console.log("Database relation set up successfully!");
}
