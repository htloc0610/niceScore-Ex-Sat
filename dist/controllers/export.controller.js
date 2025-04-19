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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const exceljs_1 = __importDefault(require("exceljs"));
const student_service_1 = __importDefault(require("../services/student.service"));
const logger_1 = require("../config/logger");
const easy_template_x_1 = require("easy-template-x");
const { convert } = require('docx2pdf-converter'); // npm package
const exportController = {
    // Hàm export dữ liệu ra JSON
    exportToJson: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const students = yield student_service_1.default.getListStudent(); // Lấy dữ liệu từ DB
            const filePath = path_1.default.join(__dirname, "../exports/students.json");
            fs_1.default.writeFileSync(filePath, JSON.stringify(students, null, 2), "utf-8");
            res.download(filePath);
        }
        catch (error) {
            console.log("Error exporting JSON:", error);
            logger_1.logger.error("Error exporting JSON: " + error.message);
            res.status(500).json({ message: "Lỗi khi export JSON", error });
        }
    }),
    exportToExcel: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const students = yield student_service_1.default.getListStudent();
            const workbook = new exceljs_1.default.Workbook();
            const worksheet = workbook.addWorksheet("Students");
            // Định nghĩa tiêu đề cột
            worksheet.columns = [
                { header: "ID", key: "student_id", width: 10 },
                { header: "Họ và tên", key: "full_name", width: 25 },
                { header: "Ngày sinh", key: "date_of_birth", width: 15 },
                { header: "Giới tính", key: "gender", width: 10 },
                { header: "Chương trình", key: "program", width: 15 },
                { header: "Email", key: "email", width: 30 },
                { header: "Số điện thoại", key: "phone_number", width: 15 },
                { header: "Quốc tịch", key: "nationality", width: 15 },
                { header: "Khoa", key: "faculty_name", width: 25 },
                { header: "Khóa học", key: "course_name", width: 25 },
                { header: "Tình trạng", key: "status_name", width: 15 },
                { header: "Địa chỉ thường trú", key: "permanent_address", width: 30 },
                { header: "Địa chỉ tạm trú", key: "temporary_address", width: 30 },
                { header: "Địa chỉ nhận thư", key: "mailing_address", width: 30 },
                { header: "Loại giấy tờ", key: "id_type", width: 15 },
                { header: "Số giấy tờ", key: "id_number", width: 20 },
                { header: "Ngày cấp", key: "id_issue_date", width: 15 },
                { header: "Ngày hết hạn", key: "id_expiry_date", width: 15 },
                { header: "Nơi cấp", key: "id_place_of_issue", width: 20 },
                { header: "Quốc gia cấp", key: "id_country_of_issue", width: 15 },
                { header: "Có chip?", key: "id_has_chip", width: 10 },
                { header: "Ghi chú", key: "id_notes", width: 25 },
            ];
            // Thêm dữ liệu vào bảng
            students.forEach((student) => {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4;
                worksheet.addRow({
                    student_id: student.student_id,
                    full_name: student.full_name,
                    date_of_birth: student.date_of_birth,
                    gender: student.gender,
                    program: student.program,
                    email: student.email,
                    phone_number: student.phone_number,
                    nationality: student.nationality,
                    faculty_name: (_a = student.faculty) === null || _a === void 0 ? void 0 : _a.name,
                    course_name: (_b = student.course) === null || _b === void 0 ? void 0 : _b.course_name,
                    status_name: (_c = student.status) === null || _c === void 0 ? void 0 : _c.name,
                    permanent_address: `${(_d = student.permanentAddress) === null || _d === void 0 ? void 0 : _d.house_number}, ${(_e = student.permanentAddress) === null || _e === void 0 ? void 0 : _e.street_name}, ${(_f = student.permanentAddress) === null || _f === void 0 ? void 0 : _f.ward}, ${(_g = student.permanentAddress) === null || _g === void 0 ? void 0 : _g.district}, ${(_h = student.permanentAddress) === null || _h === void 0 ? void 0 : _h.city}, ${(_j = student.permanentAddress) === null || _j === void 0 ? void 0 : _j.country}`,
                    temporary_address: `${(_k = student.temporaryAddress) === null || _k === void 0 ? void 0 : _k.house_number}, ${(_l = student.temporaryAddress) === null || _l === void 0 ? void 0 : _l.street_name}, ${(_m = student.temporaryAddress) === null || _m === void 0 ? void 0 : _m.ward}, ${(_o = student.temporaryAddress) === null || _o === void 0 ? void 0 : _o.district}, ${(_p = student.temporaryAddress) === null || _p === void 0 ? void 0 : _p.city}, ${(_q = student.temporaryAddress) === null || _q === void 0 ? void 0 : _q.country}`,
                    mailing_address: `${(_r = student.mailingAddress) === null || _r === void 0 ? void 0 : _r.house_number}, ${(_s = student.mailingAddress) === null || _s === void 0 ? void 0 : _s.street_name}, ${(_t = student.mailingAddress) === null || _t === void 0 ? void 0 : _t.ward}, ${(_u = student.mailingAddress) === null || _u === void 0 ? void 0 : _u.district}, ${(_v = student.mailingAddress) === null || _v === void 0 ? void 0 : _v.city}, ${(_w = student.mailingAddress) === null || _w === void 0 ? void 0 : _w.country}`,
                    id_type: (_x = student.identification) === null || _x === void 0 ? void 0 : _x.type,
                    id_number: (_y = student.identification) === null || _y === void 0 ? void 0 : _y.number,
                    id_issue_date: (_z = student.identification) === null || _z === void 0 ? void 0 : _z.issue_date,
                    id_expiry_date: (_0 = student.identification) === null || _0 === void 0 ? void 0 : _0.expiry_date,
                    id_place_of_issue: (_1 = student.identification) === null || _1 === void 0 ? void 0 : _1.place_of_issue,
                    id_country_of_issue: (_2 = student.identification) === null || _2 === void 0 ? void 0 : _2.country_of_issue,
                    id_has_chip: ((_3 = student.identification) === null || _3 === void 0 ? void 0 : _3.has_chip) ? "Có" : "Không",
                    id_notes: ((_4 = student.identification) === null || _4 === void 0 ? void 0 : _4.notes) || "",
                });
            });
            // Xuất file Excel
            const filePath = path_1.default.join(__dirname, "../exports/students.xlsx");
            yield workbook.xlsx.writeFile(filePath);
            res.download(filePath);
        }
        catch (error) {
            logger_1.logger.error("Error exporting Excel: " + error.message);
            console.log("Error exporting Excel:", error);
            res.status(500).json({ message: "Lỗi khi export Excel", error });
        }
    }),
    /*exportGrade: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
  
        const grades = await studentService.getStudentGrades(parseInt(id));
    
        res.status(200).json(grades);
        // const workbook = new ExcelJS.Workbook();
        // const worksheet = workbook.addWorksheet("Grades");
  
        // // Định nghĩa tiêu đề cột
        // worksheet.columns = [
        //   { header: "ID Sinh viên", key: "student_id", width: 15 },
        //   { header: "Họ và tên", key: "full_name", width: 25 },
        //   { header: "Môn học", key: "subject", width: 20 },
        //   { header: "Điểm", key: "grade", width: 10 },
        //   { header: "Học kỳ", key: "semester", width: 15 },
        //   { header: "Năm học", key: "academic_year", width: 15 },
        // ];
  
        // // Thêm dữ liệu vào bảng
        // grades.forEach((grade: any) => {
        //   worksheet.addRow({
        //     student_id: grade.student_id,
        //     full_name: grade.full_name,
        //     subject: grade.subject,
        //     grade: grade.grade,
        //     semester: grade.semester,
        //     academic_year: grade.academic_year,
        //   });
        // });
  
        // // Xuất file Excel
        // const filePath = path.join(__dirname, "../exports/grades.xlsx");
        // await workbook.xlsx.writeFile(filePath);
  
        // res.download(filePath);
      } catch (error) {
        logger.error("Error exporting grades: " + error.message);
        console.log("Error exporting grades:", error);
        res.status(500).json({ message: "Lỗi khi export điểm", error });
      }
    }*/
    exportGrade: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { id } = req.params;
            // Fetch grades and student details
            const rawGrades = (yield student_service_1.default.getStudentGrades(parseInt(id)));
            const grades = rawGrades.map((grade, index) => ({
                idx: index + 1,
                credits: grade.credits,
                module_code: grade.module_code,
                module_name: grade.module_name,
                grade: parseFloat(grade.grade),
                GPA: (parseFloat(grade.grade) * 0.4).toFixed(2),
            }));
            const student = yield student_service_1.default.getStudentById(parseInt(id));
            const safeGrades = Array.isArray(grades)
                ? grades.filter(g => g && g.grade >= 5)
                : [];
            const total_credits = safeGrades.reduce((sum, g) => sum + (g.credits || 0), 0);
            const average_grade = safeGrades.length
                ? (safeGrades.reduce((sum, g) => sum + g.grade, 0) / safeGrades.length).toFixed(2)
                : "N/A";
            const average_gpa = total_credits
                ? (safeGrades.reduce((sum, g) => sum + g.grade * g.credits * 0.4, 0) / total_credits).toFixed(2)
                : "N/A";
            const data = {
                student_name: student.full_name,
                s_id: student.student_id,
                s_birthday: student.date_of_birth,
                course_name: (_a = student.course) === null || _a === void 0 ? void 0 : _a.course_name,
                program_name: student.program || "Không có",
                total_credits: total_credits,
                average_grade: average_grade,
                average_gpa: average_gpa,
                grades,
            };
            // Path to the Word template
            const templateFilePath = path_1.default.join(__dirname, '../templates/grade.docx');
            const templateFile = fs_1.default.readFileSync(templateFilePath);
            const handler = new easy_template_x_1.TemplateHandler();
            const doc = yield handler.process(templateFile, data);
            const docxPath = path_1.default.join(__dirname, `temp-${id}.docx`);
            const pdfPath = path_1.default.join(__dirname, `temp-${id}.pdf`);
            fs_1.default.writeFileSync(docxPath, doc);
            yield convert(docxPath, pdfPath);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
            const pdfBuffer = fs_1.default.readFileSync(pdfPath);
            res.send(pdfBuffer);
            if (fs_1.default.existsSync(docxPath))
                fs_1.default.unlinkSync(docxPath);
            if (fs_1.default.existsSync(pdfPath))
                fs_1.default.unlinkSync(pdfPath);
        }
        catch (error) {
            // Handle error and log it
            console.error("Error exporting grade:", error);
            logger_1.logger.error("Error exporting grades: " + error.message);
            res.status(500).json({ message: "Error exporting grades", error: error.message });
        }
    })
};
exports.default = exportController;
//# sourceMappingURL=export.controller.js.map