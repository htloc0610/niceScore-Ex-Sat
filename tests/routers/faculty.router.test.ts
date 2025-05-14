import request from "supertest";
import express from "express";
import facultyRouter from "../../src/routes/faculty.router";

// Mock the facultyController methods
jest.mock("../../src/controllers/faculty.controller", () => ({
    getListFaculties: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "Engineering" }])),
    addFaculty: jest.fn((req, res) => res.status(201).json({ id: 2, name: req.body.name })),
    updateFaculty: jest.fn((req, res) => res.status(200).json({ id: req.body.id, name: req.body.name })),
}));

const app = express();
app.use(express.json());
app.use("/api/faculty", facultyRouter);

describe("facultyRouter", () => {
    it("GET /api/faculty should return list of faculties", async () => {
        const res = await request(app).get("/api/faculty");
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0]).toHaveProperty("name", "Engineering");
    });

    it("POST /api/faculty should add a faculty", async () => {
        const res = await request(app)
            .post("/api/faculty")
            .send({ name: "Science" });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("name", "Science");
    });

    it("PUT /api/faculty should update a faculty", async () => {
        const res = await request(app)
            .put("/api/faculty")
            .send({ id: 1, name: "Updated Faculty" });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("name", "Updated Faculty");
        expect(res.body).toHaveProperty("id", 1);
    });
});
