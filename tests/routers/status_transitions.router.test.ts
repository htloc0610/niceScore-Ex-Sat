import request from "supertest";
import express from "express";
import statusTransitionsRouter from "../../src/routes/status_transitions.router";

// Mock the controller methods
jest.mock("../../src/controllers/status_transitions.controller", () => ({
  getStatusTransitions: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "Test" }])),
  getValidNextStatusById: jest.fn((req, res) => res.status(200).json({ id: req.params.id, valid: true })),
  addStatusTransitions: jest.fn((req, res) => res.status(201).json({ success: true })),
  updateStatusTransitions: jest.fn((req, res) => res.status(200).json({ updated: true })),
  deleteStatusTransitions: jest.fn((req, res) => res.status(204).send()),
}));

const app = express();
app.use(express.json());
app.use("/api/status_transition", statusTransitionsRouter);

describe("statusTransitionsRouter", () => {
  it("GET /api/status_transition should return status transitions", async () => {
    const res = await request(app).get("/api/status_transition");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/status_transition/:id should return valid next status by id", async () => {
    const res = await request(app).get("/api/status_transition/123");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", "123");
    expect(res.body).toHaveProperty("valid", true);
  });

  it("POST /api/status_transition should add status transition", async () => {
    const res = await request(app)
      .post("/api/status_transition")
      .send({ name: "New Status" });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("success", true);
  });

  it("PUT /api/status_transition should update status transition", async () => {
    const res = await request(app)
      .put("/api/status_transition")
      .send({ id: 1, name: "Updated Status" });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("updated", true);
  });

  it("DELETE /api/status_transition/:id should delete status transition", async () => {
    const res = await request(app).delete("/api/status_transition/1");
    expect(res.status).toBe(204);
  });
});
