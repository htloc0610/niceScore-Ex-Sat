import request from "supertest";
import express from "express";
import configurationsRouter from "../../src/routes/configurations.router";

// Mock the controller methods
jest.mock("../../src/controllers/configurations.controller", () => ({
    getListConfigurations: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "Test Config" }])),
    addConfiguration: jest.fn((req, res) => res.status(201).json({ id: 2, ...req.body })),
    updateConfiguration: jest.fn((req, res) => res.status(200).json({ success: true })),
}));

const app = express();
app.use(express.json());
app.use("/api/configurations", configurationsRouter);

describe("Configurations Router", () => {
    it("GET /api/configurations should return list of configurations", async () => {
        const res = await request(app).get("/api/configurations");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("id");
    });

    it("POST /api/configurations should add a configuration", async () => {
        const configData = { name: "New Config" };
        const res = await request(app)
            .post("/api/configurations")
            .send(configData);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(configData);
        expect(res.body).toHaveProperty("id");
    });

    it("PUT /api/configurations should update a configuration", async () => {
        const updateData = { id: 1, name: "Updated Config" };
        const res = await request(app)
            .put("/api/configurations")
            .send(updateData);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("success", true);
    });
});
