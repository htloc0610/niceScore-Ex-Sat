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
const configurations_controller_1 = __importDefault(require("../../src/controllers/configurations.controller"));
const configurations_service_1 = __importDefault(require("../../src/services/configurations.service"));
const logger_1 = require("../../src/config/logger");
// Mock các dependencies
jest.mock("../../src/services/configurations.service");
jest.mock("../../src/config/logger");
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
};
describe("statusController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getListConfigurations", () => {
        it("should return list of configurations on success", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockConfigurations = [
                { id: 1, config_key: "key1", config_value: "value1" },
            ];
            configurations_service_1.default.getAllConfiguration.mockResolvedValue(mockConfigurations);
            const req = {};
            const res = mockResponse();
            yield configurations_controller_1.default.getListConfigurations(req, res);
            expect(configurations_service_1.default.getAllConfiguration).toHaveBeenCalled();
            expect(logger_1.logger.info).toHaveBeenCalledWith("Fetched list of configurations successfully");
            expect(res.send).toHaveBeenCalledWith({
                message: "List of configurations",
                configurations: mockConfigurations,
            });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Database error");
            configurations_service_1.default.getAllConfiguration.mockRejectedValue(error);
            const req = {};
            const res = mockResponse();
            yield configurations_controller_1.default.getListConfigurations(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith("An error occurred while fetching configurations", error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while fetching configurations.",
            });
        }));
    });
    describe("updateConfiguration", () => {
        it("should update configuration successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = { config_key: "key1", config_value: "new_value" };
            const mockUpdatedConfig = Object.assign(Object.assign({}, mockData), { id: 1 });
            configurations_service_1.default.updateConfiguration.mockResolvedValue(mockUpdatedConfig);
            const req = { body: mockData };
            const res = mockResponse();
            yield configurations_controller_1.default.updateConfiguration(req, res);
            expect(configurations_service_1.default.updateConfiguration).toHaveBeenCalledWith(mockData);
            expect(logger_1.logger.info).toHaveBeenCalledWith("Configuration updated successfully");
            expect(res.send).toHaveBeenCalledWith({
                message: "Configuration updated successfully",
                updatedConfiguration: mockUpdatedConfig,
            });
        }));
        it("should return 404 if configuration is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = { config_key: "key1", config_value: "new_value" };
            configurations_service_1.default.updateConfiguration.mockResolvedValue(null);
            const req = { body: mockData };
            const res = mockResponse();
            yield configurations_controller_1.default.updateConfiguration(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith("Configuration not found");
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: "Configuration not found",
            });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = { config_key: "key1", config_value: "new_value" };
            const error = new Error("Unexpected error");
            configurations_service_1.default.updateConfiguration.mockRejectedValue(error);
            const req = { body: mockData };
            const res = mockResponse();
            yield configurations_controller_1.default.updateConfiguration(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith("An error occurred while updating the configuration", error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while updating the configuration.",
            });
        }));
    });
    describe("addConfiguration", () => {
        it("should add a new configuration successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = { config_key: "key1", config_value: "value1" };
            const mockNewConfig = Object.assign(Object.assign({}, mockData), { id: 1 });
            configurations_service_1.default.addConfiguration.mockResolvedValue(mockNewConfig);
            const req = { body: mockData };
            const res = mockResponse();
            yield configurations_controller_1.default.addConfiguration(req, res);
            expect(configurations_service_1.default.addConfiguration).toHaveBeenCalledWith(mockData);
            expect(logger_1.logger.info).toHaveBeenCalledWith("Status added successfully");
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                message: "Status added successfully",
                newStatus: mockNewConfig,
            });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = { config_key: "key1", config_value: "value1" };
            const error = new Error("Database error");
            configurations_service_1.default.addConfiguration.mockRejectedValue(error);
            const req = { body: mockData };
            const res = mockResponse();
            yield configurations_controller_1.default.addConfiguration(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith("An error occurred while adding the status", error);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while adding the status.",
            });
        }));
    });
});
//# sourceMappingURL=configurations.controller.test.js.map