"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_model_1 = __importDefault(require("../models/student.model"));
const faculty_model_1 = __importDefault(require("../models/faculty.model"));
const course_model_1 = __importDefault(require("../models/course.model"));
const address_model_1 = __importDefault(require("../models/address.model"));
const status_model_1 = __importDefault(require("../models/status.model"));
const transcripts_model_1 = __importDefault(require("../models/transcripts.model"));
const modules_model_1 = __importDefault(require("../models/modules.model"));
const classes_model_1 = __importDefault(require("../models/classes.model"));
const identification_model_1 = __importDefault(require("../models/identification.model"));
const address_service_1 = __importDefault(require("./address.service"));
const identification_service_1 = __importDefault(require("./identification.service"));
const logger_1 = require("../config/logger");
const studentService = {
    // Get list of students with related data
    getListStudent() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const students = yield student_model_1.default.findAll({
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
                            model: faculty_model_1.default,
                            as: "faculty",
                            attributes: ["name"], // Lấy tên khoa
                        },
                        {
                            model: course_model_1.default,
                            as: "course",
                            attributes: ["course_name"], // Lấy thông tin khóa học
                        },
                        {
                            model: status_model_1.default,
                            as: "status",
                            attributes: ["name"], // Lấy trạng thái sinh viên
                        },
                        {
                            model: address_model_1.default,
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
                            model: address_model_1.default,
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
                            model: address_model_1.default,
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
                            model: identification_model_1.default,
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
            }
            catch (error) {
                logger_1.logger.error("Error fetching students list: " + error.message);
                console.log("Error fetching students list:", error);
                throw new Error("Error fetching students list: " + error.message);
            }
        });
    },
    // Add a new student
    addStudent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Tạo promises để thêm địa chỉ thường trú, tạm trú, nhận thư
                const permanentAddressPromise = address_service_1.default.addAddress(data.permanent);
                const temporaryAddressPromise = address_service_1.default.addAddress(data.temporary);
                const mailingAddressPromise = address_service_1.default.addAddress(data.mailing);
                // Tạo promise để thêm giấy tờ tùy thân
                const identificationPromise = identification_service_1.default.addIdentification({
                    type: data.type,
                    number: data.number,
                    issue_date: data.issue_date,
                    expiry_date: data.expiry_date,
                    place_of_issue: data.place_of_issue,
                    country_of_issue: data.country_of_issue,
                    has_chip: data.has_chip || false,
                    notes: data.notes || "",
                });
                // Chạy tất cả promises cùng lúc
                const [permanentAddress, temporaryAddress, mailingAddress, identification,] = yield Promise.all([
                    permanentAddressPromise,
                    temporaryAddressPromise,
                    mailingAddressPromise,
                    identificationPromise,
                ]);
                // Sau khi đã có tất cả địa chỉ và giấy tờ, thêm sinh viên
                const newStudent = yield student_model_1.default.create({
                    student_id: data.student_id,
                    full_name: data.full_name,
                    date_of_birth: data.date_of_birth,
                    gender: data.gender,
                    faculty_id: data.faculty_id,
                    course_id: data.course_id,
                    program: data.program,
                    status_id: data.status_id,
                    nationality: data.nationality,
                    email: data.email,
                    phone_number: data.phone_number,
                    permanent_address_id: permanentAddress.address_id,
                    temporary_address_id: temporaryAddress.address_id,
                    mailing_address_id: mailingAddress.address_id,
                    identification_id: identification.identification_id,
                });
                return newStudent;
            }
            catch (error) {
                logger_1.logger.error("Error adding student: " + error.message);
                console.error("Error adding student:", error);
                throw error;
            }
        });
    },
    // Delete a student by ID
    deleteStudent(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield student_model_1.default.destroy({
                    where: { student_id: studentId },
                });
                if (result === 0) {
                    throw new Error("Student not found");
                }
                return result;
            }
            catch (error) {
                throw new Error("Error deleting student");
            }
        });
    },
    // Update a student by ID
    updateStudent(studentId, studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = student_model_1.default.build(studentData);
                yield student.validate();
                const [updated] = yield student_model_1.default.update(studentData, {
                    where: { student_id: studentId },
                });
                if (updated === 0) {
                    throw new Error("Student not found");
                }
                const updatedStudent = yield student_model_1.default.findOne({
                    where: { student_id: studentId },
                });
                return updatedStudent ? updatedStudent.get() : null;
            }
            catch (error) {
                logger_1.logger.error("Error updating student: " + error.message);
                console.log("Error updating student:", error);
                throw new Error(error.message);
            }
        });
    },
    // Add a new student from JSON data
    addJson(studentJson) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentData = studentJson;
                // Create related entities first
                const faculty = yield faculty_model_1.default.findOrCreate({
                    where: { name: studentData.faculty.name },
                });
                const course = yield course_model_1.default.findOrCreate({
                    where: { course_name: studentData.course.course_name },
                });
                const status = yield status_model_1.default.findOrCreate({
                    where: { name: studentData.status.name },
                });
                const permanentAddress = yield address_service_1.default.addAddress(studentData.permanentAddress);
                const temporaryAddress = yield address_service_1.default.addAddress(studentData.temporaryAddress);
                const mailingAddress = yield address_service_1.default.addAddress(studentData.mailingAddress);
                const identification = yield identification_service_1.default.addIdentification(studentData.identification);
                // Assign the IDs of the related entities to the student data
                studentData.faculty_id = faculty[0].faculty_id;
                studentData.course_id = course[0].course_id;
                studentData.status_id = status[0].status_id;
                studentData.permanent_address_id = permanentAddress.address_id;
                studentData.temporary_address_id = temporaryAddress.address_id;
                studentData.mailing_address_id = mailingAddress.address_id;
                studentData.identification_id = identification.identification_id;
                // Create the student
                const newStudent = yield student_model_1.default.create(studentData);
                return newStudent;
            }
            catch (error) {
                logger_1.logger.error("Error adding student from JSON: " + error.message);
                console.log("Error adding student from JSON:", error);
                throw new Error("Error adding student from JSON: " + error.message);
            }
        });
    },
    // Add a new student from Excel data
    addExcel(studentExcel) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentData = studentExcel;
                // Create related entities first
                const faculty = yield faculty_model_1.default.findOrCreate({
                    where: { name: studentData.faculty.name },
                });
                const course = yield course_model_1.default.findOrCreate({
                    where: { course_name: studentData.course.course_name },
                });
                const status = yield status_model_1.default.findOrCreate({
                    where: { name: studentData.status.name },
                });
                const permanentAddress = yield address_service_1.default.addAddress(studentData.permanentAddress);
                const temporaryAddress = yield address_service_1.default.addAddress(studentData.temporaryAddress);
                const mailingAddress = yield address_service_1.default.addAddress(studentData.mailingAddress);
                const identification = yield identification_service_1.default.addIdentification(studentData.identification);
                // Assign the IDs of the related entities to the student data
                studentData.faculty_id = faculty[0].faculty_id;
                studentData.course_id = course[0].course_id;
                studentData.status_id = status[0].status_id;
                studentData.permanent_address_id = permanentAddress.address_id;
                studentData.temporary_address_id = temporaryAddress.address_id;
                studentData.mailing_address_id = mailingAddress.address_id;
                studentData.identification_id =
                    identification.dataValues.identification_id;
                // Remove unnecessary fields
                delete studentData.faculty;
                delete studentData.course;
                delete studentData.status;
                delete studentData.permanentAddress;
                delete studentData.temporaryAddress;
                delete studentData.mailingAddress;
                delete studentData.identification;
                // Create the student
                const newStudent = yield student_model_1.default.create(studentData);
                return newStudent;
            }
            catch (error) {
                logger_1.logger.error("Error adding student from Excel: " + error.message);
                console.log("Error adding student from Excel:", error);
                throw new Error("Error adding student from Excel: " + error.message);
            }
        });
    },
    getFacultyName(faculty_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const faculty = yield faculty_model_1.default.findOne({ where: { faculty_id } });
            return faculty;
        });
    },
    getStudentById(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield student_model_1.default.findOne({
                    where: { student_id: studentId },
                    include: [
                        {
                            model: faculty_model_1.default,
                            as: "faculty",
                        },
                        {
                            model: course_model_1.default,
                            as: "course",
                        },
                        {
                            model: status_model_1.default,
                            as: "status",
                        },
                        {
                            model: address_model_1.default,
                            as: "permanentAddress",
                        },
                        {
                            model: address_model_1.default,
                            as: "temporaryAddress",
                        },
                        {
                            model: address_model_1.default,
                            as: "mailingAddress",
                        },
                        {
                            model: identification_model_1.default,
                            as: "identification",
                        },
                    ],
                });
                return student;
            }
            catch (error) {
                throw new Error("Error fetching student by id");
            }
        });
    },
    //updateStudentById
    updateStudentById(studentId, studentData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //updateAddress: async (addressId: number, addressData:
                const permanentAddress = yield address_service_1.default.updateAddress(studentData.permanentAddress.permanent_address_id, studentData.permanentAddress);
                const temporaryAddress = yield address_service_1.default.updateAddress(studentData.temporaryAddress.temporary_address_id, studentData.temporaryAddress);
                const mailingAddress = yield address_service_1.default.updateAddress(studentData.mailingAddress.mailing_address_id, studentData.mailingAddress);
                const identification = yield identification_service_1.default.updateIdentification(studentData.identification.identification_id, studentData.identification);
                // Assign the IDs of the related entities to the student data
                studentData.permanent_address_id = permanentAddress.address_id;
                studentData.temporary_address_id = temporaryAddress.address_id;
                studentData.mailing_address_id = mailingAddress.address_id;
                studentData.identification_id = identification.identification_id;
                // Remove unnecessary fields
                delete studentData.faculty;
                delete studentData.course;
                delete studentData.status;
                delete studentData.permanentAddress;
                delete studentData.temporaryAddress;
                delete studentData.mailingAddress;
                delete studentData.identification;
                studentData.status_id = parseInt(studentData.status_id, 10);
                console.log("studentData", studentData);
                // Update the student
                const [updated] = yield student_model_1.default.update(studentData, {
                    where: { student_id: studentId },
                });
                if (updated === 0) {
                    throw new Error("Student not found");
                }
                const updatedStudent = yield student_model_1.default.findOne({
                    where: { student_id: studentId },
                });
                return updatedStudent ? updatedStudent.get() : null;
            }
            catch (error) {
                logger_1.logger.error("Error updating student: " + error.message);
                console.log("Error updating student:", error);
                throw new Error(error.message);
            }
        });
    },
    getStudentStatus(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield student_model_1.default.findOne({
                    where: { student_id: studentId },
                    include: [
                        {
                            model: status_model_1.default,
                            as: "status",
                            attributes: ["status_id"],
                        },
                    ],
                });
                if (!student) {
                    throw new Error("Student not found");
                }
                return student.dataValues.status.status_id;
            }
            catch (error) {
                logger_1.logger.error("Error fetching student status: " + error.message);
                console.log("Error fetching student status:", error);
                throw new Error("Error fetching student status: " + error.message);
            }
        });
    },
    getStudentGrades(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const grades = yield transcripts_model_1.default.findAll({
                    where: { student_id: studentId },
                    include: [
                        {
                            model: classes_model_1.default,
                            as: "class", // Ensure this matches the alias set in the association
                            include: [
                                {
                                    model: modules_model_1.default,
                                    as: "module", // Ensure 'module' alias is correct
                                    attributes: ["module_code", "module_name", "credits"],
                                },
                            ],
                            attributes: ["class_name"],
                        },
                    ],
                    attributes: ["grade"],
                });
                if (!grades || grades.length === 0) {
                    throw new Error("No grades found for the student");
                }
                // Map the result to return the desired format
                const formattedGrades = grades.map((item) => {
                    const plainItem = item.get({ plain: true }); // Convert Sequelize instance to plain object
                    console.log(plainItem);
                    return {
                        grade: plainItem.grade,
                        transcript_id: plainItem.transcript_id, // Accessing class_name from the related Class model
                        module_name: plainItem.class.module.module_name, // Accessing module_name from the related Module model
                        module_code: plainItem.class.module.module_code, // Accessing module_code from the related Module model
                        credits: plainItem.class.module.credits, // Accessing credits from the related Module model
                    };
                });
                console.log(formattedGrades); // You can log the formatted result if needed
                return formattedGrades; // Return the formatted grades array
            }
            catch (error) {
                logger_1.logger.error("Error fetching student grades: " + error.message);
                console.log("Error fetching student grades:", error);
                throw new Error("Error fetching student grades: " + error.message);
            }
        });
    }
};
exports.default = studentService;
//# sourceMappingURL=student.service.js.map