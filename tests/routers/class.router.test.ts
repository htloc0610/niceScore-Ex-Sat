import request from "supertest";
import express from "express";
import classRouter from "../../src/routes/class.router";

// Mock the controller methods
jest.mock("../../src/controllers/class.controller", () => ({
    getClassByModuleId: jest.fn((req, res) => res.status(200).json({ route: "getClassByModuleId", id: req.params.id })),
    getListClasses: jest.fn((req, res) => res.status(200).json({ route: "getListClasses" })),
    addClass: jest.fn((req, res) => res.status(201).json({ route: "addClass", body: req.body })),
    getClass: jest.fn((req, res) => res.status(200).json({ route: "getClass", id: req.params.id })),
    updateClass: jest.fn((req, res) => res.status(200).json({ route: "updateClass", id: req.params.id, body: req.body })),
    deleteClass: jest.fn((req, res) => res.status(204).send()),
}));

const app = express();
app.use(express.json());
app.use("/api/class", classRouter);

describe("classRouter", () => {
    it("GET /api/class/module/:id should call getClassByModuleId", async () => {
        const res = await request(app).get("/api/class/module/123");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ route: "getClassByModuleId", id: "123" });
    });

    it("GET /api/class should call getListClasses", async () => {
        const res = await request(app).get("/api/class");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ route: "getListClasses" });
    });

    it("POST /api/class should call addClass", async () => {
        const res = await request(app)
            .post("/api/class")
            .send({ name: "Test Class" });
        expect(res.status).toBe(201);
        expect(res.body).toEqual({ route: "addClass", body: { name: "Test Class" } });
    });

    it("GET /api/class/:id should call getClass", async () => {
        const res = await request(app).get("/api/class/456");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ route: "getClass", id: "456" });
    });

    it("PUT /api/class/:id should call updateClass", async () => {
        const res = await request(app)
            .put("/api/class/789")
            .send({ name: "Updated Class" });
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ route: "updateClass", id: "789", body: { name: "Updated Class" } });
    });

    it("DELETE /api/class/:id should call deleteClass", async () => {
        const res = await request(app).delete("/api/class/999");
        expect(res.status).toBe(204);
        expect(res.text).toBe("");
    });
});
