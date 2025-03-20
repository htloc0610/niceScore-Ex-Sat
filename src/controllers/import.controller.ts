import { Request, Response } from "express";
import ExcelJS from "exceljs";
import studentService from "../services/student.service";

function parseAddress(address: string) {
  const [house_number, street_name, ward, district, city, country] =
    address.split(", ");
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
export const importJson = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
    }

    const jsonData = file.buffer.toString("utf8");
    const students = JSON.parse(jsonData);

    for (const student of students) {
      await studentService.addJson(student);
    }

    res.status(200).json({ message: "Import JSON thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi import JSON", error: error });
  }
};

export const importExcel = async (req: Request, res: Response) => {
  try {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.getWorksheet(1);
    const students: any[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
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
      await studentService.addExcel(student);
    }

    res.status(200).json({ message: "Import Excel thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi import Excel", error: error });
  }
};
