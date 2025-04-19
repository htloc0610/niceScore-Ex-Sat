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
// tests/services/faculty.service.test.ts
const faculty_service_1 = __importDefault(require("../../src/services/faculty.service"));
const faculty_model_1 = __importDefault(require("../../src/models/faculty.model"));
jest.mock("../../src/models/faculty.model");
jest.mock("../../src/config/logger", () => ({
    logger: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));
describe("facultyService", () => {
    describe("getAllFaculties", () => {
        it("should return a list of all faculties", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockFaculties = [
                {
                    dataValues: {
                        faculty_id: 1,
                        name: "Faculty of Science",
                    },
                },
                {
                    dataValues: {
                        faculty_id: 2,
                        name: "Faculty of Engineering",
                    },
                },
            ];
            faculty_model_1.default.findAll.mockResolvedValue(mockFaculties);
            const result = yield faculty_service_1.default.getAllFaculties();
            expect(faculty_model_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual([
                mockFaculties[0].dataValues,
                mockFaculties[1].dataValues,
            ]);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            faculty_model_1.default.findAll.mockRejectedValue(new Error("Test error"));
            yield expect(faculty_service_1.default.getAllFaculties()).rejects.toThrow("Error fetching all faculties");
        }));
    });
    describe("getFaculties", () => {
        it("should return all faculties", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockFaculties = [
                { faculty_id: 1, name: "Faculty of Science" },
                { faculty_id: 2, name: "Faculty of Engineering" },
            ];
            faculty_model_1.default.findAll.mockResolvedValue(mockFaculties);
            const result = yield faculty_service_1.default.getFaculties();
            expect(faculty_model_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual(mockFaculties);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            faculty_model_1.default.findAll.mockRejectedValue(new Error("Test error"));
            yield expect(faculty_service_1.default.getFaculties()).rejects.toThrow("Error fetching faculties list");
        }));
    });
    describe("updateFaculty", () => {
        it("should update an existing faculty", () => __awaiter(void 0, void 0, void 0, function* () {
            const facultyId = 1;
            const facultyData = { name: "Faculty of Business" };
            const mockUpdatedFaculty = {
                faculty_id: facultyId,
                name: "Faculty of Business",
            };
            faculty_model_1.default.update.mockResolvedValue([1]); // 1 row affected
            faculty_model_1.default.findOne.mockResolvedValue({
                get: jest.fn(() => mockUpdatedFaculty),
            });
            const result = yield faculty_service_1.default.updateFaculty(facultyId, facultyData);
            expect(faculty_model_1.default.update).toHaveBeenCalledWith(facultyData, {
                where: { faculty_id: facultyId },
            });
            expect(result).toEqual(mockUpdatedFaculty);
        }));
        it("should return null if faculty not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const facultyId = 1;
            const facultyData = { name: "Faculty of Business" };
            faculty_model_1.default.update.mockResolvedValue([0]); // No rows affected
            yield expect(faculty_service_1.default.updateFaculty(facultyId, facultyData)).rejects.toThrow("Faculty not found");
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const facultyId = 1;
            const facultyData = { name: "Faculty of Business" };
            faculty_model_1.default.update.mockRejectedValue(new Error("Test error"));
            yield expect(faculty_service_1.default.updateFaculty(facultyId, facultyData)).rejects.toThrow("Test error");
        }));
    });
});
//# sourceMappingURL=faculty.service.test.js.map