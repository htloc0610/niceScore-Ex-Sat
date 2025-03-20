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
exports.exportToExcel = exports.exportToJson = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const exceljs_1 = __importDefault(require("exceljs"));
const student_service_1 = __importDefault(require("../services/student.service"));
const logger_1 = require("../config/logger");
// Hàm export dữ liệu ra JSON
const exportToJson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield student_service_1.default.getList(); // Lấy dữ liệu từ DB
        const filePath = path_1.default.join(__dirname, "../exports/students.json");
        fs_1.default.writeFileSync(filePath, JSON.stringify(students, null, 2), "utf-8");
        res.download(filePath);
    }
    catch (error) {
        console.log("Error exporting JSON:", error);
        logger_1.logger.error("Error exporting JSON: " + error.message);
        res.status(500).json({ message: "Lỗi khi export JSON", error });
    }
});
exports.exportToJson = exportToJson;
const exportToExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const students = yield student_service_1.default.getList();
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
});
exports.exportToExcel = exportToExcel;
//# sourceMappingURL=export.controller.js.map