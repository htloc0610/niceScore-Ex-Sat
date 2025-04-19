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
const faculty_controller_1 = __importDefault(require("../../src/controllers/faculty.controller"));
const faculty_service_1 = __importDefault(require("../../src/services/faculty.service"));
const logger_1 = require("../../src/config/logger");
// Mock service và logger
jest.mock("../../src/services/faculty.service");
jest.mock("../../src/config/logger");
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
};
describe("facultyController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getListFaculties", () => {
        it("should return list of faculties on success", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockFaculties = [
                { id: 1, name: "Engineering" },
                { id: 2, name: "Science" },
            ];
            faculty_service_1.default.getFaculties.mockResolvedValue(mockFaculties);
            const req = {};
            const res = mockResponse();
            yield faculty_controller_1.default.getListFaculties(req, res);
            expect(faculty_service_1.default.getFaculties).toHaveBeenCalled();
            expect(logger_1.logger.info).toHaveBeenCalledWith("Successfully fetched faculties list");
            expect(res.send).toHaveBeenCalledWith({
                message: "List of faculties",
                faculties: mockFaculties,
            });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Database error");
            faculty_service_1.default.getFaculties.mockRejectedValue(error);
            const req = {};
            const res = mockResponse();
            yield faculty_controller_1.default.getListFaculties(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith("Error fetching faculties list");
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while fetching faculties.",
            });
        }));
    });
    describe("addFaculty", () => {
        it("should add faculty successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const newFacultyData = { name: "Business" };
            const mockNewFaculty = Object.assign({ id: 3 }, newFacultyData);
            faculty_service_1.default.addFaculty.mockResolvedValue(mockNewFaculty);
            const req = { body: newFacultyData };
            const res = mockResponse();
            yield faculty_controller_1.default.addFaculty(req, res);
            expect(faculty_service_1.default.addFaculty).toHaveBeenCalledWith("Business");
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                message: "Faculty added successfully",
                newFaculty: mockNewFaculty,
            });
        }));
        it("should handle errors when adding faculty", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error adding faculty");
            faculty_service_1.default.addFaculty.mockRejectedValue(error);
            const req = { body: { name: "Business" } };
            const res = mockResponse();
            yield faculty_controller_1.default.addFaculty(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while adding the faculty.",
            });
        }));
    });
    describe("updateFaculty", () => {
        it("should update faculty successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedFacultyData = { faculty_id: 1, name: "Updated Engineering" };
            const mockUpdatedFaculty = Object.assign({ id: 1 }, updatedFacultyData);
            faculty_service_1.default.updateFaculty.mockResolvedValue(mockUpdatedFaculty);
            const req = { body: updatedFacultyData };
            const res = mockResponse();
            yield faculty_controller_1.default.updateFaculty(req, res);
            expect(faculty_service_1.default.updateFaculty).toHaveBeenCalledWith(1, updatedFacultyData);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                message: "Faculty updated successfully",
                updatedFaculty: mockUpdatedFaculty,
            });
        }));
        it("should return 404 if faculty not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedFacultyData = {
                faculty_id: 99,
                name: "Nonexistent Faculty",
            };
            faculty_service_1.default.updateFaculty.mockResolvedValue(null);
            const req = { body: updatedFacultyData };
            const res = mockResponse();
            yield faculty_controller_1.default.updateFaculty(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: "Faculty not found or no changes made.",
            });
        }));
        it("should handle errors when updating faculty", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error updating faculty");
            faculty_service_1.default.updateFaculty.mockRejectedValue(error);
            const req = {
                body: { faculty_id: 1, name: "Updated Engineering" },
            };
            const res = mockResponse();
            yield faculty_controller_1.default.updateFaculty(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while updating the faculty.",
            });
        }));
    });
});
//# sourceMappingURL=faculty.controller.test.js.map