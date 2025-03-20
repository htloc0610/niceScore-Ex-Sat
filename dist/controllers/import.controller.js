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
exports.importExcel = exports.importJson = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const student_service_1 = __importDefault(require("../services/student.service"));
const logger_1 = require("../config/logger");
function parseAddress(address) {
    const [house_number, street_name, ward, district, city, country] = address.split(", ");
    return {
        house_number,
        street_name,
        ward,
        district,
        city,
        country,
    };
}
// Hàm export dữ liệu ra JSON
const importJson = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
        }
        const jsonData = file.buffer.toString("utf8");
        const students = JSON.parse(jsonData);
        for (const student of students) {
            yield student_service_1.default.addJson(student);
        }
        logger_1.logger.info("Import JSON thành công");
        res.status(200).json({ message: "Import JSON thành công" });
    }
    catch (error) {
        logger_1.logger.error("Error importing JSON: " + error.message);
        console.log("Error importing JSON:", error);
        res.status(500).json({ message: "Lỗi khi import JSON", error: error });
    }
});
exports.importJson = importJson;
const importExcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ message: "No file uploaded" });
            return;
        }
        const workbook = new exceljs_1.default.Workbook();
        yield workbook.xlsx.load(file.buffer);
        const worksheet = workbook.getWorksheet(1);
        const students = [];
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1)
                return; // Skip header row
            const student = {
                student_id: row.getCell(1).value,
                full_name: row.getCell(2).value,
                date_of_birth: row.getCell(3).value,
                gender: row.getCell(4).value,
                program: row.getCell(5).value,
                email: row.getCell(6).value,
                phone_number: row.getCell(7).value,
                nationality: row.getCell(8).value,
                faculty: {
                    name: row.getCell(9).value,
                },
                course: {
                    course_name: row.getCell(10).value,
                },
                status: {
                    name: row.getCell(11).value,
                },
                permanentAddress: parseAddress(row.getCell(12).value.toString()),
                temporaryAddress: parseAddress(row.getCell(13).value.toString()),
                mailingAddress: parseAddress(row.getCell(14).value.toString()),
                identification: {
                    type: row.getCell(15).value,
                    number: row.getCell(16).value,
                    issue_date: row.getCell(17).value,
                    expiry_date: row.getCell(18).value,
                    place_of_issue: row.getCell(19).value,
                    country_of_issue: row.getCell(20).value,
                    has_chip: row.getCell(21).value === "có",
                    notes: row.getCell(22).value,
                },
            };
            students.push(student);
        });
        for (const student of students) {
            yield student_service_1.default.addExcel(student);
        }
        logger_1.logger.info("Import Excel thành công");
        res.status(200).json({ message: "Import Excel thành công" });
    }
    catch (error) {
        logger_1.logger.error("Error importing Excel: " + error.message);
        console.log("Error importing Excel", error);
        res.status(500).json({ message: "Lỗi khi import Excel", error: error });
    }
});
exports.importExcel = importExcel;
//# sourceMappingURL=import.controller.js.map