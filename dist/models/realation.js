"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupRelation;
const student_model_1 = __importDefault(require("./student.model"));
const faculty_model_1 = __importDefault(require("./faculty.model"));
const status_model_1 = __importDefault(require("./status.model"));
const identification_model_1 = __importDefault(require("./identification.model"));
const address_model_1 = __importDefault(require("./address.model"));
const course_model_1 = __importDefault(require("./course.model"));
function setupRelation() {
    // Student - Faculty
    student_model_1.default.belongsTo(faculty_model_1.default, { foreignKey: "faculty_id" });
    faculty_model_1.default.hasMany(student_model_1.default, { foreignKey: "faculty_id" });
    // Student - Status
    student_model_1.default.belongsTo(status_model_1.default, { foreignKey: "status_id" });
    status_model_1.default.hasMany(student_model_1.default, { foreignKey: "status_id" });
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
    // Address - Student (Mỗi địa chỉ có thể thuộc nhiều sinh viên)
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
    student_model_1.default.belongsTo(identification_model_1.default, { foreignKey: "identification_id" });
    identification_model_1.default.hasMany(student_model_1.default, { foreignKey: "identification_id" });
    // Student - Course
    student_model_1.default.belongsTo(course_model_1.default, { foreignKey: "course_id" });
    course_model_1.default.hasMany(student_model_1.default, { foreignKey: "course_id" });
    console.log("Database relation set up successfully!");
}
//# sourceMappingURL=realation.js.map