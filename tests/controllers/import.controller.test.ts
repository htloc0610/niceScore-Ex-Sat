import { importJson, importExcel } from "../../src/controllers/import.controller";
import studentService from "../../src/services/student.service";
import { logger } from "../../src/config/logger";
import ExcelJS from "exceljs";

jest.mock("../../src/services/student.service");
jest.mock("../../src/config/logger");

describe("import.controller", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("importJson", () => {
    it("should return 400 if no file uploaded", async () => {
      req.file = undefined;
      await importJson(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "No file uploaded" });
    });

    it("should import students from JSON and return 200", async () => {
      const students = [{ name: "A" }, { name: "B" }];
      req.file = {
        buffer: Buffer.from(JSON.stringify(students), "utf8"),
      };
      (studentService.addJson as jest.Mock).mockResolvedValue(undefined);

      await importJson(req, res);

      expect(studentService.addJson).toHaveBeenCalledTimes(2);
      expect(logger.info).toHaveBeenCalledWith("Import JSON thành công");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Import JSON thành công" });
    });

    it("should handle JSON import errors", async () => {
      req.file = {
        buffer: Buffer.from("invalid json", "utf8"),
      };
      await importJson(req, res);
      expect(logger.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Lỗi khi import JSON" })
      );
    });
  });

  describe("importExcel", () => {
    it("should return 400 if no file uploaded", async () => {
      req.file = undefined;
      await importExcel(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "No file uploaded" });
    });

    it("should import students from Excel and return 200", async () => {
      // Prepare a workbook in memory
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Sheet1");
      worksheet.addRow([
        "student_id", "full_name", "date_of_birth", "gender", "program", "email", "phone_number", "nationality",
        "faculty", "course", "status", "1, Street, Ward, District, City, Country",
        "2, Street, Ward, District, City, Country", "3, Street, Ward, District, City, Country",
        "type", "number", "issue_date", "expiry_date", "place_of_issue", "country_of_issue", "có", "notes"
      ]);
      worksheet.addRow([
        "123", "John Doe", "2000-01-01", "Male", "CS", "john@example.com", "123456789", "VN",
        "IT", "K17", "Active", "1, Main, W1, D1, C1, VN",
        "2, Main, W2, D2, C2, VN", "3, Main, W3, D3, C3, VN",
        "CCCD", "012345", "2020-01-01", "2030-01-01", "HN", "VN", "có", "none"
      ]);
      const buffer = await workbook.xlsx.writeBuffer();
      req.file = { buffer };

      (studentService.addExcel as jest.Mock).mockResolvedValue(undefined);

      await importExcel(req, res);

      expect(studentService.addExcel).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith("Import Excel thành công");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Import Excel thành công" });
    });

    it("should handle Excel import errors", async () => {
      req.file = { buffer: Buffer.from("not an excel file") };
      await importExcel(req, res);
      expect(logger.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Lỗi khi import Excel" })
      );
    });
  });
});
