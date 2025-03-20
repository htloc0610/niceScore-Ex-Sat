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
const identification_model_1 = __importDefault(require("../models/identification.model"));
const address_service_1 = __importDefault(require("./address.service"));
const identification_service_1 = __importDefault(require("./identification.service"));
const logger_1 = require("../config/logger");
const studentService = {
    // Get list of students with related data
    getList() {
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
    // Get list of faculties
    getFaculties() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const faculties = yield faculty_model_1.default.findAll();
                console.log("faculty: ", faculties);
                return faculties;
            }
            catch (error) {
                logger_1.logger.error("Error fetching faculties list");
                throw new Error("Error fetching faculties list");
            }
        });
    },
    // Get list of status
    getStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const status = yield status_model_1.default.findAll();
                return status;
            }
            catch (error) {
                throw new Error("Error fetching status list");
            }
        });
    },
    // Add a new student 
    /*
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
        logger.error("Error adding new student" + error);
        console.log("Error adding new student:", error);
        throw new Error("Error adding new student" + error);
      }
    },
    */
    addStudent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(data);
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
                console.log(data.type, data.number, "issue_date", data.issue_date, "expiry_date", data.expiry_date, "place_of_issue", data.place_of_issue, "country_of_issue", data.country_of_issue, "has_chip", data.has_chip || false, "notes", data.notes || "");
                // Chạy tất cả promises cùng lúc
                const [permanentAddress, temporaryAddress, mailingAddress, identification] = yield Promise.all([
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
    delete(studentId) {
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
    update(studentId, studentData) {
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
    addFaculty(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newFaculty = yield faculty_model_1.default.create(data);
                return Object.assign({}, newFaculty.toJSON());
            }
            catch (error) {
                throw new Error("Error adding new faculty" + error);
            }
        });
    },
    updateFaculty(facultyId, facultyData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield faculty_model_1.default.update(facultyData, {
                    where: { faculty_id: facultyId },
                });
                if (updated === 0) {
                    throw new Error("Faculty not found");
                }
                const updatedFaculty = yield faculty_model_1.default.findOne({
                    where: { faculty_id: facultyId },
                });
                return updatedFaculty ? updatedFaculty.get() : null;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    },
    addStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newStatus = yield status_model_1.default.create(data);
                return Object.assign({}, newStatus.toJSON());
            }
            catch (error) {
                throw new Error("Error adding new status" + error);
            }
        });
    },
    updateStatus(statusId, statusData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield status_model_1.default.update(statusData, {
                    where: { status_id: statusId },
                });
                if (updated === 0) {
                    throw new Error("Status not found");
                }
                const updatedStatus = yield status_model_1.default.findOne({
                    where: { status_id: statusId },
                });
                return updatedStatus ? updatedStatus.get() : null;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    },
    //add course
    addCourse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newCourse = yield course_model_1.default.create(data);
                return Object.assign({}, newCourse.toJSON());
            }
            catch (error) {
                throw new Error("Error adding new course" + error);
            }
        });
    },
    //update course
    updateCourse(courseId, courseData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [updated] = yield course_model_1.default.update(courseData, {
                    where: { course_id: courseId },
                });
                if (updated === 0) {
                    throw new Error("Course not found");
                }
                const updatedCourse = yield course_model_1.default.findOne({
                    where: { course_id: courseId },
                });
                return updatedCourse ? updatedCourse.get() : null;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    },
    //getCourses
    getCourses() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield course_model_1.default.findAll();
                return courses;
            }
            catch (error) {
                throw new Error("Error fetching courses list");
            }
        });
    },
    //getStudentById
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
                // Update related entities first
                const faculty = yield faculty_model_1.default.findOrCreate({
                    where: { name: studentData.faculty.name },
                });
                const course = yield course_model_1.default.findOrCreate({
                    where: { course_name: studentData.course.course_name },
                });
                const status = yield status_model_1.default.findOrCreate({
                    where: { name: studentData.status.name },
                });
                //updateAddress: async (addressId: number, addressData:
                const permanentAddress = yield address_service_1.default.updateAddress(studentData.permanentAddress.permanent_address_id, studentData.permanentAddress);
                const temporaryAddress = yield address_service_1.default.updateAddress(studentData.temporaryAddress.temporary_address_id, studentData.temporaryAddress);
                const mailingAddress = yield address_service_1.default.updateAddress(studentData.mailingAddress.mailing_address_id, studentData.mailingAddress);
                const identification = yield identification_service_1.default.updateIdentification(studentData.identification.identification_id, studentData.identification);
                // Assign the IDs of the related entities to the student data
                studentData.faculty_id = faculty[0].faculty_id;
                studentData.course_id = course[0].course_id;
                studentData.status_id = status[0].status_id;
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
};
exports.default = studentService;
//# sourceMappingURL=student.service.js.map