import request from "supertest";
import express from "express";
import statusRouter from "../../src/routes/status.router";

// Mock the statusController methods
jest.mock("../../src/controllers/status.controller", () => ({
    getListStatus: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "Active" }])),
    addStatus: jest.fn((req, res) => res.status(201).json({ id: 2, name: req.body.name })),
    updateStatus: jest.fn((req, res) => res.status(200).json({ id: req.body.id, name: req.body.name })),
}));

const app = express();
app.use(express.json());
app.use("/api/status", statusRouter);

describe("Status Router", () => {
    it("GET /api/status should return status list", async () => {
        const res = await request(app).get("/api/status");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("id");
        expect(res.body[0]).toHaveProperty("name");
    });

    it("POST /api/status should add a new status", async () => {
        const res = await request(app)
            .post("/api/status")
            .send({ name: "Inactive" });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.name).toBe("Inactive");
    });

    it("PUT /api/status should update a status", async () => {
        const res = await request(app)
            .put("/api/status")
            .send({ id: 1, name: "Updated" });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: 1, name: "Updated" });
    });
});
