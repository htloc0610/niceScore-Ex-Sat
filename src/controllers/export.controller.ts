import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import ExcelJS from "exceljs";
import studentService from "../services/student.service";
import { logger } from "../config/logger";
import { TemplateHandler } from 'easy-template-x';
const { convert } = require('docx2pdf-converter'); // npm package

const exportController = {
  // Hàm export dữ liệu ra JSON
  exportToJson: async (req: Request, res: Response) => {
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
  },

  exportToExcel: async (req: Request, res: Response) => {
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
  },

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
    
    exportGrade: async (req: Request, res: Response) => {
        try {
          const { id } = req.params;
    
          // Fetch grades and student details
          const rawGrades = (await studentService.getStudentGrades(parseInt(id)));
          const grades = rawGrades.map((grade: any, index: number) => ({
            idx: index + 1,
            credits: grade.credits,
            module_code: grade.module_code,
            module_name: grade.module_name,
            grade: parseFloat(grade.grade),
            GPA: (parseFloat(grade.grade) *0.4).toFixed(2),
          }));

          const student = await studentService.getStudentById(parseInt(id)) as any;
          
          const safeGrades = Array.isArray(grades)
          ? grades.filter(g => g && g.grade >= 5)
          : [];

          const total_credits = safeGrades.reduce((sum, g) => sum + (g.credits || 0), 0);

          const average_grade = safeGrades.length
          ? (safeGrades.reduce((sum, g) => sum + g.grade, 0) / safeGrades.length).toFixed(2)
          : "N/A";

          const average_gpa = total_credits
          ? (safeGrades.reduce((sum, g) => sum + g.grade * g.credits*0.4, 0) / total_credits).toFixed(2)
          : "N/A";

          const data = {
            student_name: student.full_name,
            s_id: student.student_id,
            s_birthday: student.date_of_birth,
            course_name: student.course?.course_name,
            program_name: student.program || "Không có",
            total_credits: total_credits,
            average_grade: average_grade,
            average_gpa: average_gpa,
            grades,
          };

    
          // Path to the Word template
          const templateFilePath = path.join(__dirname, '../templates/grade.docx');
          const templateFile = fs.readFileSync(templateFilePath);
          const handler = new TemplateHandler();
          const doc = await handler.process(templateFile, data);
          const docxPath = path.join(__dirname, `temp-${id}.docx`);
          const pdfPath = path.join(__dirname, `temp-${id}.pdf`);

          fs.writeFileSync(docxPath, doc);          
          await convert(docxPath, pdfPath);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
          const pdfBuffer = fs.readFileSync(pdfPath);
          res.send(pdfBuffer);
          if (fs.existsSync(docxPath)) fs.unlinkSync(docxPath);
          if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
          } catch (error) {
          // Handle error and log it
          console.error("Error exporting grade:", error);
          logger.error("Error exporting grades: " + error.message);
          res.status(500).json({ message: "Error exporting grades", error: error.message });
        }
      }
    };    

export default exportController;
