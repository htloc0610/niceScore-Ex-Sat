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
// tests/services/configuration.service.test.ts
const configurations_service_1 = __importDefault(require("../../src/services/configurations.service"));
const configurations_model_1 = __importDefault(require("../../src/models/configurations.model"));
jest.mock("../../src/models/configurations.model");
describe("configurationService", () => {
    describe("getAllConfiguration", () => {
        it("should return all configurations", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockConfigs = [
                {
                    dataValues: {
                        config_key: "app_name",
                        config_value: "MyApp",
                    },
                },
            ];
            configurations_model_1.default.findAll.mockResolvedValue(mockConfigs);
            const result = yield configurations_service_1.default.getAllConfiguration();
            expect(configurations_model_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockConfigs[0].dataValues]);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            configurations_model_1.default.findAll.mockRejectedValue(new Error("Test error"));
            yield expect(configurations_service_1.default.getAllConfiguration()).rejects.toThrow("Test error");
        }));
    });
    describe("getConfiguration", () => {
        it("should return a configuration by key", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockConfig = {
                dataValues: {
                    config_key: "app_name",
                    config_value: "MyApp",
                },
            };
            configurations_model_1.default.findOne.mockResolvedValue(mockConfig);
            const result = yield configurations_service_1.default.getConfiguration("app_name");
            expect(configurations_model_1.default.findOne).toHaveBeenCalledWith({
                where: { config_key: "app_name" },
            });
            expect(result).toEqual(mockConfig.dataValues);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            configurations_model_1.default.findOne.mockRejectedValue(new Error("Test error"));
            yield expect(configurations_service_1.default.getConfiguration("app_name")).rejects.toThrow("Test error");
        }));
    });
    describe("configureConfiguration", () => {
        it("should create a new configuration", () => __awaiter(void 0, void 0, void 0, function* () {
            const configData = { name: "app_name", value: "MyApp" };
            configurations_model_1.default.create.mockResolvedValue(configData);
            const result = yield configurations_service_1.default.configureConfiguration(configData);
            expect(configurations_model_1.default.create).toHaveBeenCalledWith(configData);
            expect(result).toEqual(configData);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const configData = { name: "app_name", value: "MyApp" };
            configurations_model_1.default.create.mockRejectedValue(new Error("Test error"));
            yield expect(configurations_service_1.default.configureConfiguration(configData)).rejects.toThrow("Test error");
        }));
    });
    describe("addConfiguration", () => {
        it("should add a new configuration", () => __awaiter(void 0, void 0, void 0, function* () {
            const configData = { name: "app_version", value: "1.0" };
            configurations_model_1.default.create.mockResolvedValue(configData);
            const result = yield configurations_service_1.default.addConfiguration(configData);
            expect(configurations_model_1.default.create).toHaveBeenCalledWith(configData);
            expect(result).toEqual(configData);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const configData = { name: "app_version", value: "1.0" };
            configurations_model_1.default.create.mockRejectedValue(new Error("Test error"));
            yield expect(configurations_service_1.default.addConfiguration(configData)).rejects.toThrow("Test error");
        }));
    });
    describe("updateConfiguration", () => {
        it("should update an existing configuration", () => __awaiter(void 0, void 0, void 0, function* () {
            const configData = { config_key: "app_version", config_value: "1.1" };
            const mockExistingConfig = {
                dataValues: {
                    config_key: "app_version",
                    config_value: "1.0",
                },
            };
            configurations_model_1.default.findOne.mockResolvedValue(mockExistingConfig);
            configurations_model_1.default.update.mockResolvedValue([
                1,
                [{ dataValues: Object.assign({}, configData) }],
            ]);
            const result = yield configurations_service_1.default.updateConfiguration(configData);
            expect(configurations_model_1.default.findOne).toHaveBeenCalledWith({
                where: { config_key: "app_version" },
            });
            expect(configurations_model_1.default.update).toHaveBeenCalledWith({ config_value: "1.1" }, { where: { config_key: "app_version" }, returning: true });
            expect(result).toEqual(configData);
        }));
        it("should return null if configuration not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const configData = {
                config_key: "non_existing_key",
                config_value: "1.1",
            };
            configurations_model_1.default.findOne.mockResolvedValue(null);
            const result = yield configurations_service_1.default.updateConfiguration(configData);
            expect(result).toBeNull();
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const configData = { config_key: "app_version", config_value: "1.1" };
            configurations_model_1.default.findOne.mockRejectedValue(new Error("Test error"));
            yield expect(configurations_service_1.default.updateConfiguration(configData)).rejects.toThrow("Test error");
        }));
    });
});
//# sourceMappingURL=configuration.service.test.js.map