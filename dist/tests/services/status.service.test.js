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
const status_service_1 = __importDefault(require("../../src/services/status.service"));
const status_model_1 = __importDefault(require("../../src/models/status.model"));
const logger_1 = require("../../src/config/logger");
jest.mock("../../src/models/status.model");
jest.mock("../../src/config/logger", () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
    },
}));
describe("statusService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getAllStatuses", () => {
        it("should return all statuses in ascending order", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockStatuses = [
                {
                    status_id: 1,
                    name: "Pending",
                    dataValues: { status_id: 1, name: "Pending" },
                },
                {
                    status_id: 2,
                    name: "Approved",
                    dataValues: { status_id: 2, name: "Approved" },
                },
            ];
            status_model_1.default.findAll.mockResolvedValue(mockStatuses);
            const result = yield status_service_1.default.getAllStatuses();
            expect(status_model_1.default.findAll).toHaveBeenCalledWith({
                order: [["status_id", "ASC"]],
            });
            expect(logger_1.logger.info).toHaveBeenCalledWith("Fetched status list successfully");
            expect(result).toEqual([
                { status_id: 1, name: "Pending" },
                { status_id: 2, name: "Approved" },
            ]);
        }));
        it("should handle errors when fetching statuses", () => __awaiter(void 0, void 0, void 0, function* () {
            status_model_1.default.findAll.mockRejectedValue(new Error("Database error"));
            yield expect(status_service_1.default.getAllStatuses()).rejects.toThrow("Error fetching status list");
            expect(logger_1.logger.error).toHaveBeenCalledWith("Error fetching status list: Database error");
        }));
    });
    describe("getStatus", () => {
        it("should return all statuses", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockStatuses = [{ status_id: 1, name: "Pending" }];
            status_model_1.default.findAll.mockResolvedValue(mockStatuses);
            const result = yield status_service_1.default.getStatus();
            expect(status_model_1.default.findAll).toHaveBeenCalled();
            expect(logger_1.logger.info).toHaveBeenCalledWith("Fetched status list successfully");
            expect(result).toEqual(mockStatuses);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            status_model_1.default.findAll.mockRejectedValue(new Error("DB error"));
            yield expect(status_service_1.default.getStatus()).rejects.toThrow("Error fetching status list");
            expect(logger_1.logger.error).toHaveBeenCalledWith("Error fetching status list: DB error");
        }));
    });
    describe("addStatus", () => {
        it("should add a new status and return it", () => __awaiter(void 0, void 0, void 0, function* () {
            const name = "In Progress";
            const createdStatus = {
                toJSON: () => ({ status_id: 3, name }),
            };
            status_model_1.default.create.mockResolvedValue(createdStatus);
            const result = yield status_service_1.default.addStatus(name);
            expect(status_model_1.default.create).toHaveBeenCalledWith({ name });
            expect(logger_1.logger.info).toHaveBeenCalledWith("Added new status successfully");
            expect(result).toEqual({ status_id: 3, name });
        }));
        it("should handle errors when adding status", () => __awaiter(void 0, void 0, void 0, function* () {
            status_model_1.default.create.mockRejectedValue(new Error("Create error"));
            yield expect(status_service_1.default.addStatus("Test")).rejects.toThrow("Error adding new status: Create error");
            expect(logger_1.logger.error).toHaveBeenCalledWith("Error adding new status: Create error");
        }));
    });
    describe("updateStatus", () => {
        it("should update status and return updated data", () => __awaiter(void 0, void 0, void 0, function* () {
            const statusId = 1;
            const statusData = { name: "Updated Name" };
            const updatedStatus = {
                get: () => ({ status_id: 1, name: "Updated Name" }),
            };
            status_model_1.default.update.mockResolvedValue([1]);
            status_model_1.default.findOne.mockResolvedValue(updatedStatus);
            const result = yield status_service_1.default.updateStatus(statusId, statusData);
            expect(status_model_1.default.update).toHaveBeenCalledWith(statusData, {
                where: { status_id: statusId },
            });
            expect(status_model_1.default.findOne).toHaveBeenCalledWith({
                where: { status_id: statusId },
            });
            expect(logger_1.logger.info).toHaveBeenCalledWith("Updated status with id 1 successfully");
            expect(result).toEqual({ status_id: 1, name: "Updated Name" });
        }));
        it("should throw an error if status not found", () => __awaiter(void 0, void 0, void 0, function* () {
            status_model_1.default.update.mockResolvedValue([0]);
            yield expect(status_service_1.default.updateStatus(1, { name: "X" })).rejects.toThrow("Status not found");
            expect(logger_1.logger.error).toHaveBeenCalledWith("Status with id 1 not found");
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            status_model_1.default.update.mockRejectedValue(new Error("Update error"));
            yield expect(status_service_1.default.updateStatus(1, { name: "Fail" })).rejects.toThrow("Update error");
            expect(logger_1.logger.error).toHaveBeenCalledWith("Error updating status with id 1: Update error");
        }));
    });
});
//# sourceMappingURL=status.service.test.js.map