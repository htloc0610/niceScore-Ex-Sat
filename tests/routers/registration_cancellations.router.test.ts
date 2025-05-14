import request from "supertest";
import express from "express";
import classCancellationRouter from "../../src/routes/registration_cancellations.router";

// Mock the controller methods
jest.mock("../../src/controllers/class_cancellation.controller", () => ({
  getClassCancellationList: jest.fn((req, res) => res.status(200).json([{ id: 1 }])),
  getClassCancellationDetails: jest.fn((req, res) => res.status(200).json({ id: req.params.moduleID })),
  getRegistrationCancellationsByStudentId: jest.fn((req, res) => res.status(200).json([{ studentId: req.params.studentId }]))
}));

const app = express();
app.use(express.json());
app.use("/api/class_cancellation", classCancellationRouter);

describe("classCancellationRouter", () => {
  it("GET /api/class_cancellation should return class cancellation list", async () => {
    const res = await request(app).get("/api/class_cancellation");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/class_cancellation/:moduleID should return class cancellation details", async () => {
    const res = await request(app).get("/api/class_cancellation/123");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", "123");
  });

  it("GET /api/class_cancellation/student/:studentId should return cancellations by studentId", async () => {
    const res = await request(app).get("/api/class_cancellation/student/456");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]).toHaveProperty("studentId", "456");
  });

  it("GET /api/class_cancellation/unknown should still call getClassCancellationDetails", async () => {
    const res = await request(app).get("/api/class_cancellation/unknown");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", "unknown");
  });

});
