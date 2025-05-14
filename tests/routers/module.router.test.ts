import request from "supertest";
import express from "express";
import moduleRouter from "../../src/routes/module.router";

// Mock the controller methods
jest.mock("../../src/controllers/module.controller", () => ({
    getListModules: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "Math" }])),
    addModule: jest.fn((req, res) => res.status(201).json({ id: 2, ...req.body })),
    getModule: jest.fn((req, res) => res.status(200).json({ id: req.params.id, name: "Physics" })),
    updateModule: jest.fn((req, res) => res.status(200).json({ id: req.params.id, ...req.body })),
    deleteModule: jest.fn((req, res) => res.status(204).send()),
}));

const app = express();
app.use(express.json());
app.use("/api/module", moduleRouter);

describe("Module Router", () => {
    it("GET /api/module should return list of modules", async () => {
        const res = await request(app).get("/api/module");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("id");
    });

    it("POST /api/module should add a module", async () => {
        const moduleData = { name: "Chemistry" };
        const res = await request(app).post("/api/module").send(moduleData);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(moduleData);
        expect(res.body).toHaveProperty("id");
    });

    it("GET /api/module/:id should return a module", async () => {
        const res = await request(app).get("/api/module/123");
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("id", "123");
    });

    it("PUT /api/module/:id should update a module", async () => {
        const updateData = { name: "Biology" };
        const res = await request(app).put("/api/module/456").send(updateData);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject({ id: "456", ...updateData });
    });

    it("DELETE /api/module/:id should delete a module", async () => {
        const res = await request(app).delete("/api/module/789");
        expect(res.status).toBe(204);
    });
});
