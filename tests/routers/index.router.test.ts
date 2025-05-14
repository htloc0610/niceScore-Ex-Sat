import express, { Application } from "express";
import request from "supertest";
import setupRoutes from "../../src/routes/index.router";

// Mock all routers
jest.mock("../../src/routes/student.router", () => jest.fn((req, res) => res.status(200).send("student")));
jest.mock("../../src/routes/front.router", () => jest.fn((req, res) => res.status(200).send("front")));
jest.mock("../../src/routes/export.routes", () => jest.fn((req, res) => res.status(200).send("export")));
jest.mock("../../src/routes/import.router", () => jest.fn((req, res) => res.status(200).send("import")));
jest.mock("../../src/routes/faculty.router", () => jest.fn((req, res) => res.status(200).send("faculty")));
jest.mock("../../src/routes/status.router", () => jest.fn((req, res) => res.status(200).send("status")));
jest.mock("../../src/routes/course.router", () => jest.fn((req, res) => res.status(200).send("course")));
jest.mock("../../src/routes/status_transitions.router", () => jest.fn((req, res) => res.status(200).send("status_transition")));
jest.mock("../../src/routes/configurations.router", () => jest.fn((req, res) => res.status(200).send("configurations")));
jest.mock("../../src/routes/module.router", () => jest.fn((req, res) => res.status(200).send("module")));
jest.mock("../../src/routes/class.router", () => jest.fn((req, res) => res.status(200).send("class")));
jest.mock("../../src/routes/transcript.router", () => jest.fn((req, res) => res.status(200).send("transcript")));
jest.mock("../../src/routes/class_registation.router", () => jest.fn((req, res) => res.status(200).send("class_registation")));
jest.mock("../../src/routes/registration_cancellations.router", () => jest.fn((req, res) => res.status(200).send("class_cancellation")));

describe("setupRoutes", () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    setupRoutes(app);
  });

  it("should mount /api/student route", async () => {
    const res = await request(app).get("/api/student");
    expect(res.text).toBe("student");
  });

  it("should mount /api/faculty route", async () => {
    const res = await request(app).get("/api/faculty");
    expect(res.text).toBe("faculty");
  });

  it("should mount /api/status route", async () => {
    const res = await request(app).get("/api/status");
    expect(res.text).toBe("status");
  });

  it("should mount /api/course route", async () => {
    const res = await request(app).get("/api/course");
    expect(res.text).toBe("course");
  });

  it("should mount /api/module route", async () => {
    const res = await request(app).get("/api/module");
    expect(res.text).toBe("module");
  });

  it("should mount /api/class route", async () => {
    const res = await request(app).get("/api/class");
    expect(res.text).toBe("class");
  });

  it("should mount /api/transcript route", async () => {
    const res = await request(app).get("/api/transcript");
    expect(res.text).toBe("transcript");
  });

  it("should mount /api/class_registation route", async () => {
    const res = await request(app).get("/api/class_registation");
    expect(res.text).toBe("class_registation");
  });

  it("should mount /api/class_cancellation route", async () => {
    const res = await request(app).get("/api/class_cancellation");
    expect(res.text).toBe("class_cancellation");
  });

  it("should mount /api/status_transition route", async () => {
    const res = await request(app).get("/api/status_transition");
    expect(res.text).toBe("status_transition");
  });

  it("should mount /api/configurations route", async () => {
    const res = await request(app).get("/api/configurations");
    expect(res.text).toBe("configurations");
  });

  it("should mount /export route", async () => {
    const res = await request(app).get("/export");
    expect(res.text).toBe("export");
  });

  it("should mount /import route", async () => {
    const res = await request(app).get("/import");
    expect(res.text).toBe("import");
  });

  it("should mount / (frontRouter) route", async () => {
    const res = await request(app).get("/");
    expect(res.text).toBe("front");
  });
});
