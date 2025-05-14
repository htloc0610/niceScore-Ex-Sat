import request from "supertest";
import express from "express";
import router from "../../src/routes/front.router";

// Mock all services
jest.mock("../../src/services/configurations.service");
jest.mock("../../src/services/faculty.service");
jest.mock("../../src/services/status.service");
jest.mock("../../src/services/course.service");
jest.mock("../../src/services/student.service");
jest.mock("../../src/services/module.service");
jest.mock("../../src/services/class.service");
jest.mock("../../src/services/class_registation.service");

import configurationService from "../../src/services/configurations.service";
import facultyService from "../../src/services/faculty.service";
import statusService from "../../src/services/status.service";
import courseService from "../../src/services/course.service";
import studentService from "../../src/services/student.service";
import moduleService from "../../src/services/module.service";
import classService from "../../src/services/class.service";
import class_registationService from "../../src/services/class_registation.service";

const app = express();
app.set("view engine", "hbs");
app.set("views", __dirname); // dummy
app.use((req, res, next) => {
  // Mock res.render to send JSON for test
  res.render = (view: string, options?: any) => res.json({ view, ...options });
  next();
});
app.use("/", router);

describe("front.router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /more renders more with all data", async () => {
    (facultyService.getAllFaculties as jest.Mock).mockResolvedValue([{ id: 1 }]);
    (statusService.getAllStatuses as jest.Mock).mockResolvedValue([{ id: 2 }]);
    (courseService.getAllCourses as jest.Mock).mockResolvedValue([{ id: 3 }]);
    (moduleService.getAllModules as jest.Mock).mockResolvedValue([{ id: 4 }]);
    const res = await request(app).get("/more");
    expect(res.body).toEqual({
      view: "more",
      faculties: [{ id: 1 }],
      statuses: [{ id: 2 }],
      courses: [{ id: 3 }],
      modules: [{ id: 4 }]
    });
  });

  it("GET /add renders add", async () => {
    const res = await request(app).get("/add");
    expect(res.body).toEqual({ view: "add" });
  });

  it("GET /configurations renders configurations", async () => {
    (configurationService.getAllConfiguration as jest.Mock).mockResolvedValue([{ key: "test" }]);
    const res = await request(app).get("/configurations");
    expect(res.body).toEqual({ view: "configurations", configurations: [{ key: "test" }] });
  });

  it("GET /module renders module", async () => {
    (moduleService.getAllModules as jest.Mock).mockResolvedValue([{ id: 5 }]);
    const res = await request(app).get("/module");
    expect(res.body).toEqual({ view: "module", modules: [{ id: 5 }] });
  });

  it("GET /class/:id with valid id renders class", async () => {
    (classService.getClassById as jest.Mock).mockResolvedValue({ id: 10 });
    (class_registationService.getRegistrationsByClassId as jest.Mock).mockResolvedValue([{ student_id: 1 }]);
    const res = await request(app).get("/class/10");
    expect(res.body).toEqual({
      view: "class",
      classes: { id: 10 },
      students: [{ student_id: 1 }]
    });
  });

  it("GET /class/:id with invalid id returns 400", async () => {
    const res = await request(app).get("/class/abc");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ view: "error", message: "Invalid class ID" });
  });

  it("GET /class/:id with not found class returns 404", async () => {
    (classService.getClassById as jest.Mock).mockResolvedValue(null);
    const res = await request(app).get("/class/999");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ view: "error", message: "Class not found" });
  });

  it("GET /:id renders detail", async () => {
    const res = await request(app).get("/123");
    expect(res.body).toEqual({ view: "detail", id: "123" });
  });

  it("GET / renders index with faculties and students", async () => {
    (facultyService.getAllFaculties as jest.Mock).mockResolvedValue([{ faculty_id: "1", name: "CNTT" }]);
    (studentService.getListStudent as jest.Mock).mockResolvedValue([
      { get: () => ({ id: 1, name: "A" }) },
      { get: () => ({ id: 2, name: "B" }) }
    ]);
    const res = await request(app).get("/");
    expect(res.body).toEqual({
      view: "index",
      faculties: [
        { faculty_id: "", name: "Tất cả khoa" },
        { faculty_id: "1", name: "CNTT" }
      ],
      students: [
        { id: 1, name: "A" },
        { id: 2, name: "B" }
      ]
    });
  });
});
