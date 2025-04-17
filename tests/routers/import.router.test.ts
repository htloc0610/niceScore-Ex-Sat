import request from "supertest";
import express from "express";
import importRouter from "../../src/routes/import.router";
import {
  importJson,
  importExcel,
} from "../../src/controllers/import.controller";

// Mock controller methods
jest.mock("../../src/controllers/import.controller");

const app = express();
app.use(express.json());
app.use("/import", importRouter);

describe("Import Router", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /import/json", () => {
    it("should import JSON file successfully", async () => {
      const mockFile = Buffer.from(
        JSON.stringify([{ name: "John Doe" }]),
        "utf-8"
      );

      (importJson as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: "JSON file imported successfully" });
      });

      const response = await request(app)
        .post("/import/json")
        .attach("file", mockFile, "test.json");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("JSON file imported successfully");
      expect(importJson).toHaveBeenCalled();
    });

    it("should return 500 if there is an error importing JSON file", async () => {
      const mockFile = Buffer.from(
        JSON.stringify([{ name: "John Doe" }]),
        "utf-8"
      );

      (importJson as jest.Mock).mockImplementation((req, res) => {
        res.status(500).json({ message: "Error importing JSON file" });
      });

      const response = await request(app)
        .post("/import/json")
        .attach("file", mockFile, "test.json");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error importing JSON file");
    });
  });

  describe("POST /import/excel", () => {
    it("should import Excel file successfully", async () => {
      const mockFile = Buffer.from("Excel content", "utf-8");

      (importExcel as jest.Mock).mockImplementation((req, res) => {
        res.status(200).json({ message: "Excel file imported successfully" });
      });

      const response = await request(app)
        .post("/import/excel")
        .attach("file", mockFile, "test.xlsx");

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Excel file imported successfully");
      expect(importExcel).toHaveBeenCalled();
    });

    it("should return 500 if there is an error importing Excel file", async () => {
      const mockFile = Buffer.from("Excel content", "utf-8");

      (importExcel as jest.Mock).mockImplementation((req, res) => {
        res.status(500).json({ message: "Error importing Excel file" });
      });

      const response = await request(app)
        .post("/import/excel")
        .attach("file", mockFile, "test.xlsx");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Error importing Excel file");
    });
  });
});
