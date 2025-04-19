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
const module_service_1 = __importDefault(require("../../src/services/module.service"));
const modules_model_1 = __importDefault(require("../../src/models/modules.model"));
const classes_model_1 = __importDefault(require("../../src/models/classes.model"));
jest.mock("../../src/models/modules.model");
jest.mock("../../src/models/faculty.model");
jest.mock("../../src/models/classes.model");
jest.mock("../../src/models/class_registrations.model");
jest.mock("../../src/config/logger", () => ({
    logger: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));
describe("moduleService", () => {
    describe("getModuleById", () => {
        it("should return a module by id", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockModule = {
                module_id: 1,
                module_code: "CS101",
                name: "CS Basics",
            };
            modules_model_1.default.findOne.mockResolvedValue({
                dataValues: mockModule,
            });
            const result = yield module_service_1.default.getModuleById(1);
            expect(modules_model_1.default.findOne).toHaveBeenCalledWith({
                where: { module_id: 1 },
            });
            expect(result).toEqual(mockModule);
        }));
        it("should throw an error if module not found", () => __awaiter(void 0, void 0, void 0, function* () {
            modules_model_1.default.findOne.mockResolvedValue(null);
            yield expect(module_service_1.default.getModuleById(1)).rejects.toThrow("Module not found");
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            modules_model_1.default.findOne.mockRejectedValue(new Error("Test error"));
            yield expect(module_service_1.default.getModuleById(1)).rejects.toThrow("Error fetching module by ID: Test error");
        }));
    });
    describe("hasRegisterStudent", () => {
        it("should return true if the module has registered students", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.findOne.mockResolvedValue({
                registrations: [{ student_id: 1 }],
            });
            const result = yield module_service_1.default.hasRegisterStudent(1);
            expect(result).toBe(true);
        }));
        it("should return false if the module has no registered students", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.findOne.mockResolvedValue(null);
            const result = yield module_service_1.default.hasRegisterStudent(1);
            expect(result).toBe(false);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.findOne.mockRejectedValue(new Error("Test error"));
            yield expect(module_service_1.default.hasRegisterStudent(1)).rejects.toThrow("Error checking registered students: Test error");
        }));
    });
    describe("deleteModule", () => {
        it("should delete a module", () => __awaiter(void 0, void 0, void 0, function* () {
            const moduleId = 1;
            modules_model_1.default.destroy.mockResolvedValue(1); // 1 row affected
            const result = yield module_service_1.default.deleteModule(moduleId);
            expect(modules_model_1.default.destroy).toHaveBeenCalledWith({
                where: { module_id: moduleId },
            });
            expect(result).toEqual({ message: "Module deleted successfully" });
        }));
        it("should throw an error if module not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const moduleId = 1;
            modules_model_1.default.destroy.mockResolvedValue(0); // No rows affected
            yield expect(module_service_1.default.deleteModule(moduleId)).rejects.toThrow("Module not found");
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const moduleId = 1;
            modules_model_1.default.destroy.mockRejectedValue(new Error("Test error"));
            yield expect(module_service_1.default.deleteModule(moduleId)).rejects.toThrow("Error deleting module: Test error");
        }));
    });
    describe("isModuleOlderThan30Minutes", () => {
        it("should return true if module is older than 30 minutes", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockModule = { createdAt: new Date(Date.now() - 31 * 60 * 1000) };
            modules_model_1.default.findOne.mockResolvedValue({
                getDataValue: jest.fn().mockReturnValue(mockModule.createdAt),
            });
            const result = yield module_service_1.default.isModuleOlderThan30Minutes(1);
            expect(result).toBe(true);
        }));
        it("should return false if module is not older than 30 minutes", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockModule = { createdAt: new Date(Date.now() - 10 * 60 * 1000) };
            modules_model_1.default.findOne.mockResolvedValue({
                getDataValue: jest.fn().mockReturnValue(mockModule.createdAt),
            });
            const result = yield module_service_1.default.isModuleOlderThan30Minutes(1);
            expect(result).toBe(false);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            modules_model_1.default.findOne.mockRejectedValue(new Error("Test error"));
            yield expect(module_service_1.default.isModuleOlderThan30Minutes(1)).rejects.toThrow("Error checking module age: Test error");
        }));
    });
    describe("hasLinkedClasses", () => {
        it("should return true if module has linked classes", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.findOne.mockResolvedValue({ module_id: 1 });
            const result = yield module_service_1.default.hasLinkedClasses(1);
            expect(result).toBe(true);
        }));
        it("should return false if module has no linked classes", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.findOne.mockResolvedValue(null);
            const result = yield module_service_1.default.hasLinkedClasses(1);
            expect(result).toBe(false);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.findOne.mockRejectedValue(new Error("Test error"));
            yield expect(module_service_1.default.hasLinkedClasses(1)).rejects.toThrow("Error checking linked classes: Test error");
        }));
    });
});
//# sourceMappingURL=module.service.test.js.map