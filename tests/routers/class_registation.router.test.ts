import request from "supertest";
import express from "express";
import classRegistationRouter from "../../src/routes/class_registation.router";

// Mock the controller methods
jest.mock("../../src/controllers/class_registation.controller", () => ({
    getClassRegistationByClassId: jest.fn((req, res) => res.status(200).json({ called: "getClassRegistationByClassId", params: req.params })),
    getClassRegistationList: jest.fn((req, res) => res.status(200).json({ called: "getClassRegistationList" })),
    addClassRegistation: jest.fn((req, res) => res.status(201).json({ called: "addClassRegistation", body: req.body })),
    getClassRegistation: jest.fn((req, res) => res.status(200).json({ called: "getClassRegistation", params: req.params })),
    deleteClassRegistation: jest.fn((req, res) => res.status(204).send()),
}));

const app = express();
app.use(express.json());
app.use("/api/class_registation", classRegistationRouter);

describe("classRegistationRouter", () => {
    it("GET /api/class_registation/:classId should call getClassRegistationByClassId", async () => {
        const res = await request(app).get("/api/class_registation/123");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ called: "getClassRegistationByClassId", params: { classId: "123" } });
    });

    it("GET /api/class_registation should call getClassRegistationList", async () => {
        const res = await request(app).get("/api/class_registation");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ called: "getClassRegistationList" });
    });

    it("POST /api/class_registation should call addClassRegistation", async () => {
        const payload = { studentId: 1, classId: 2 };
        const res = await request(app).post("/api/class_registation").send(payload);
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ called: "addClassRegistation", body: payload });
    });

    it("DELETE /api/class_registation/:id should call deleteClassRegistation", async () => {
        const res = await request(app).delete("/api/class_registation/789");
        expect(res.status).toBe(204);
    });
});
