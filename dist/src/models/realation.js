"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupRelation;
const faculty_model_1 = __importDefault(require("./faculty.model"));
const status_model_1 = __importDefault(require("./status.model"));
const identification_model_1 = __importDefault(require("./identification.model"));
const address_model_1 = __importDefault(require("./address.model"));
const course_model_1 = __importDefault(require("./course.model"));
const student_model_1 = __importDefault(require("./student.model"));
const configurations_model_1 = __importDefault(require("./configurations.model"));
const status_transitions_model_1 = __importDefault(require("./status_transitions.model"));
const modules_model_1 = __importDefault(require("./modules.model"));
const classes_model_1 = __importDefault(require("./classes.model"));
const class_registrations_model_1 = __importDefault(require("./class_registrations.model"));
const registration_cancellations_model_1 = __importDefault(require("./registration_cancellations.model"));
const transcripts_model_1 = __importDefault(require("./transcripts.model"));
function setupRelation() {
    // Student - Faculty
    student_model_1.default.belongsTo(faculty_model_1.default, { foreignKey: "faculty_id", as: "faculty" });
    faculty_model_1.default.hasMany(student_model_1.default, { foreignKey: "faculty_id", as: "students" });
    // Student - Status
    student_model_1.default.belongsTo(status_model_1.default, { foreignKey: "status_id", as: "status" });
    status_model_1.default.hasMany(student_model_1.default, { foreignKey: "status_id", as: "students" });
    // Student - Address (permanent, temporary, mailing)
    student_model_1.default.belongsTo(address_model_1.default, {
        foreignKey: "permanent_address_id",
        as: "permanentAddress",
    });
    student_model_1.default.belongsTo(address_model_1.default, {
        foreignKey: "temporary_address_id",
        as: "temporaryAddress",
    });
    student_model_1.default.belongsTo(address_model_1.default, {
        foreignKey: "mailing_address_id",
        as: "mailingAddress",
    });
    address_model_1.default.hasMany(student_model_1.default, {
        foreignKey: "permanent_address_id",
        as: "permanentResidents",
    });
    address_model_1.default.hasMany(student_model_1.default, {
        foreignKey: "temporary_address_id",
        as: "temporaryResidents",
    });
    address_model_1.default.hasMany(student_model_1.default, {
        foreignKey: "mailing_address_id",
        as: "mailingResidents",
    });
    // Student - Identification
    student_model_1.default.belongsTo(identification_model_1.default, {
        foreignKey: "identification_id",
        as: "identification",
    });
    identification_model_1.default.hasMany(student_model_1.default, {
        foreignKey: "identification_id",
        as: "students",
    });
    // Student - Course
    student_model_1.default.belongsTo(course_model_1.default, { foreignKey: "course_id", as: "course" });
    course_model_1.default.hasMany(student_model_1.default, { foreignKey: "course_id", as: "students" });
    // Status - StatusTransition (current_status and new_status)
    status_model_1.default.hasMany(status_transitions_model_1.default, {
        foreignKey: "current_status",
        as: "currentStatusTransitions",
    });
    status_model_1.default.hasMany(status_transitions_model_1.default, {
        foreignKey: "new_status",
        as: "newStatusTransitions",
    });
    status_transitions_model_1.default.belongsTo(status_model_1.default, {
        foreignKey: "current_status",
        as: "currentStatus",
    });
    status_transitions_model_1.default.belongsTo(status_model_1.default, {
        foreignKey: "new_status",
        as: "newStatus",
    });
    // Module - Faculty
    modules_model_1.default.belongsTo(faculty_model_1.default, { foreignKey: "faculty_id", as: "faculty" });
    faculty_model_1.default.hasMany(modules_model_1.default, { foreignKey: "faculty_id", as: "modules" });
    // Module - Prerequisite
    modules_model_1.default.belongsTo(modules_model_1.default, { foreignKey: "prerequisite_id", as: "prerequisite" });
    modules_model_1.default.hasMany(modules_model_1.default, { foreignKey: "prerequisite_id", as: "dependentModules" });
    // Class - Module
    classes_model_1.default.belongsTo(modules_model_1.default, { foreignKey: "module_id", as: "module" });
    modules_model_1.default.hasMany(classes_model_1.default, { foreignKey: "module_id", as: "classes" });
    // ClassRegistration - Student - Class
    class_registrations_model_1.default.belongsTo(student_model_1.default, { foreignKey: "student_id", as: "student" });
    student_model_1.default.hasMany(class_registrations_model_1.default, { foreignKey: "student_id", as: "classRegistrations" });
    class_registrations_model_1.default.belongsTo(classes_model_1.default, { foreignKey: "class_id", as: "class" });
    classes_model_1.default.hasMany(class_registrations_model_1.default, { foreignKey: "class_id", as: "registrations" });
    // RegistrationCancellation - Student - Class
    registration_cancellations_model_1.default.belongsTo(student_model_1.default, { foreignKey: "student_id", as: "student" });
    student_model_1.default.hasMany(registration_cancellations_model_1.default, { foreignKey: "student_id", as: "registrationCancellations" });
    registration_cancellations_model_1.default.belongsTo(classes_model_1.default, { foreignKey: "class_id", as: "class" });
    classes_model_1.default.hasMany(registration_cancellations_model_1.default, { foreignKey: "class_id", as: "cancellations" });
    // Transcript - Student - Class
    transcripts_model_1.default.belongsTo(student_model_1.default, { foreignKey: "student_id", as: "student" });
    student_model_1.default.hasMany(transcripts_model_1.default, { foreignKey: "student_id", as: "transcripts" });
    transcripts_model_1.default.belongsTo(classes_model_1.default, { foreignKey: "class_id", as: "class" });
    classes_model_1.default.hasMany(transcripts_model_1.default, { foreignKey: "class_id", as: "transcripts" });
    configurations_model_1.default.sync();
    console.log("Database relation set up successfully!");
}
//# sourceMappingURL=realation.js.map