import request from "supertest";
import express from "express";
import exportRouter from "../../src/routes/export.routes";

// Mock the exportController methods
jest.mock("../../src/controllers/export.controller", () => ({
    exportToJson: jest.fn((req, res) => res.status(200).json({ message: "JSON exported" })),
    exportToExcel: jest.fn((req, res) => res.status(200).json({ message: "Excel exported" })),
    exportGrade: jest.fn((req, res) => res.status(200).json({ message: "Grade exported", id: req.params.id })),
}));

const app = express();
app.use("/export", exportRouter);

describe("Export Routes", () => {
    it("GET /export/json should return JSON exported message", async () => {
        const res = await request(app).get("/export/json");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "JSON exported" });
    });

    it("GET /export/excel should return Excel exported message", async () => {
        const res = await request(app).get("/export/excel");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Excel exported" });
    });

    it("GET /export/grade/:id should return Grade exported message with id", async () => {
        const res = await request(app).get("/export/grade/123");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: "Grade exported", id: "123" });
    });
});
