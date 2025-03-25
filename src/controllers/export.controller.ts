import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import studentService from "../services/student.service";
import { logger } from "../config/logger";

// Hàm export dữ liệu ra JSON
export const exportToJson = async (req: Request, res: Response) => {
  try {
    const students = await studentService.getListStudent(); // Lấy dữ liệu từ DB
    const filePath = path.join(__dirname, "../exports/students.json");
    fs.writeFileSync(filePath, JSON.stringify(students, null, 2), "utf-8");
    res.download(filePath);
  } catch (error) {
    console.log("Error exporting JSON:", error);
    logger.error("Error exporting JSON: " + error.message);
    res.status(500).json({ message: "Lỗi khi export JSON", error });
  }
};

export const exportToExcel = async (req: Request, res: Response) => {
  try {
    const students = await studentService.getListStudent();
    const workbook = new ExcelJS.Workbook();
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
    students.forEach((student: any) => {
      worksheet.addRow({
        student_id: student.student_id,
        full_name: student.full_name,
        date_of_birth: student.date_of_birth,
        gender: student.gender,
        program: student.program,
        email: student.email,
        phone_number: student.phone_number,
        nationality: student.nationality,
        faculty_name: student.faculty?.name,
        course_name: student.course?.course_name,
        status_name: student.status?.name,
        permanent_address: `${student.permanentAddress?.house_number}, ${student.permanentAddress?.street_name}, ${student.permanentAddress?.ward}, ${student.permanentAddress?.district}, ${student.permanentAddress?.city}, ${student.permanentAddress?.country}`,
        temporary_address: `${student.temporaryAddress?.house_number}, ${student.temporaryAddress?.street_name}, ${student.temporaryAddress?.ward}, ${student.temporaryAddress?.district}, ${student.temporaryAddress?.city}, ${student.temporaryAddress?.country}`,
        mailing_address: `${student.mailingAddress?.house_number}, ${student.mailingAddress?.street_name}, ${student.mailingAddress?.ward}, ${student.mailingAddress?.district}, ${student.mailingAddress?.city}, ${student.mailingAddress?.country}`,
        id_type: student.identification?.type,
        id_number: student.identification?.number,
        id_issue_date: student.identification?.issue_date,
        id_expiry_date: student.identification?.expiry_date,
        id_place_of_issue: student.identification?.place_of_issue,
        id_country_of_issue: student.identification?.country_of_issue,
        id_has_chip: student.identification?.has_chip ? "Có" : "Không",
        id_notes: student.identification?.notes || "",
      });
    });

    // Xuất file Excel
    const filePath = path.join(__dirname, "../exports/students.xlsx");
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath);
  } catch (error) {
    logger.error("Error exporting Excel: " + error.message);
    console.log("Error exporting Excel:", error);
    res.status(500).json({ message: "Lỗi khi export Excel", error });
  }
};
