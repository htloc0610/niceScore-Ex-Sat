"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const course_router_1 = __importDefault(require("../../src/routes/course.router"));
const course_controller_1 = __importDefault(require("../../src/controllers/course.controller"));
// Mock controller methods
jest.mock("../../src/controllers/course.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/course", course_router_1.default);
describe("Course Router", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("GET /api/course", () => {
        it("should fetch list of courses", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCourses = [
                { id: 1, course_name: "Mathematics" },
                { id: 2, course_name: "Physics" },
            ];
            course_controller_1.default.getListCourse.mockImplementation((req, res) => __awaiter(void 0, void 0, void 0, function* () {
                res
                    .status(200)
                    .json({ message: "List of courses", courses: mockCourses });
            }));
            const response = yield (0, supertest_1.default)(app).get("/api/course");
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("List of courses");
            expect(response.body.courses).toEqual(mockCourses);
            expect(course_controller_1.default.getListCourse).toHaveBeenCalled();
        }));
        it("should return 500 if there is an error fetching courses", () => __awaiter(void 0, void 0, void 0, function* () {
            course_controller_1.default.getListCourse.mockImplementation((req, res) => __awaiter(void 0, void 0, void 0, function* () {
                res
                    .status(500)
                    .json({ message: "An error occurred while fetching courses." });
            }));
            const response = yield (0, supertest_1.default)(app).get("/api/course");
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("An error occurred while fetching courses.");
        }));
    });
    describe("POST /api/course", () => {
        it("should return 500 if there is an error adding course", () => __awaiter(void 0, void 0, void 0, function* () {
            const newCourse = { course_name: "Chemistry" };
            course_controller_1.default.addCourse.mockImplementation((req, res) => __awaiter(void 0, void 0, void 0, function* () {
                res
                    .status(500)
                    .json({ message: "An error occurred while adding the course." });
            }));
            const response = yield (0, supertest_1.default)(app).post("/api/course").send(newCourse);
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("An error occurred while adding the course.");
        }));
    });
    describe("PUT /api/course", () => {
        it("should return 500 if there is an error updating course", () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedCourse = { course_name: "Advanced Chemistry" };
            course_controller_1.default.updateCourse.mockImplementation((req, res) => __awaiter(void 0, void 0, void 0, function* () {
                res
                    .status(500)
                    .json({ message: "An error occurred while updating the course." });
            }));
            const response = yield (0, supertest_1.default)(app)
                .put("/api/course")
                .send(updatedCourse);
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("An error occurred while updating the course.");
        }));
    });
});
//# sourceMappingURL=course.router.test.js.map