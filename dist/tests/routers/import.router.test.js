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
const import_router_1 = __importDefault(require("../../src/routes/import.router"));
const import_controller_1 = require("../../src/controllers/import.controller");
// Mock controller methods
jest.mock("../../src/controllers/import.controller");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/import", import_router_1.default);
describe("Import Router", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("POST /import/json", () => {
        it("should import JSON file successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockFile = Buffer.from(JSON.stringify([{ name: "John Doe" }]), "utf-8");
            import_controller_1.importJson.mockImplementation((req, res) => {
                res.status(200).json({ message: "JSON file imported successfully" });
            });
            const response = yield (0, supertest_1.default)(app)
                .post("/import/json")
                .attach("file", mockFile, "test.json");
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("JSON file imported successfully");
            expect(import_controller_1.importJson).toHaveBeenCalled();
        }));
        it("should return 500 if there is an error importing JSON file", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockFile = Buffer.from(JSON.stringify([{ name: "John Doe" }]), "utf-8");
            import_controller_1.importJson.mockImplementation((req, res) => {
                res.status(500).json({ message: "Error importing JSON file" });
            });
            const response = yield (0, supertest_1.default)(app)
                .post("/import/json")
                .attach("file", mockFile, "test.json");
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Error importing JSON file");
        }));
    });
    describe("POST /import/excel", () => {
        it("should import Excel file successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockFile = Buffer.from("Excel content", "utf-8");
            import_controller_1.importExcel.mockImplementation((req, res) => {
                res.status(200).json({ message: "Excel file imported successfully" });
            });
            const response = yield (0, supertest_1.default)(app)
                .post("/import/excel")
                .attach("file", mockFile, "test.xlsx");
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Excel file imported successfully");
            expect(import_controller_1.importExcel).toHaveBeenCalled();
        }));
        it("should return 500 if there is an error importing Excel file", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockFile = Buffer.from("Excel content", "utf-8");
            import_controller_1.importExcel.mockImplementation((req, res) => {
                res.status(500).json({ message: "Error importing Excel file" });
            });
            const response = yield (0, supertest_1.default)(app)
                .post("/import/excel")
                .attach("file", mockFile, "test.xlsx");
            expect(response.status).toBe(500);
            expect(response.body.message).toBe("Error importing Excel file");
        }));
    });
});
//# sourceMappingURL=import.router.test.js.map