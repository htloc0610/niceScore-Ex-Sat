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
// tests/services/class.service.test.ts
const class_service_1 = __importDefault(require("../../src/services/class.service"));
const classes_model_1 = __importDefault(require("../../src/models/classes.model"));
const modules_model_1 = __importDefault(require("../../src/models/modules.model"));
jest.mock("../../src/models/classes.model");
jest.mock("../../src/models/modules.model");
describe("classService", () => {
    describe("getAllClasses", () => {
        it("should return all classes", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockClasses = [
                {
                    dataValues: {
                        class_id: 1,
                        class_name: "Math 101",
                        instructor: "Mr. A",
                        schedule: "Mon-Wed",
                    },
                },
            ];
            classes_model_1.default.findAll.mockResolvedValue(mockClasses);
            const result = yield class_service_1.default.getAllClasses();
            expect(classes_model_1.default.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockClasses[0].dataValues]);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.findAll.mockRejectedValue(new Error("Test error"));
            yield expect(class_service_1.default.getAllClasses()).rejects.toThrow("Error fetching all classes");
        }));
    });
    describe("isActive", () => {
        it("should return true if module is active", () => __awaiter(void 0, void 0, void 0, function* () {
            modules_model_1.default.findOne.mockResolvedValue({ is_active: true });
            const result = yield class_service_1.default.isActive(1);
            expect(result).toBe(true);
        }));
        it("should return false if module is not active", () => __awaiter(void 0, void 0, void 0, function* () {
            modules_model_1.default.findOne.mockResolvedValue(null);
            const result = yield class_service_1.default.isActive(1);
            expect(result).toBe(false);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            modules_model_1.default.findOne.mockRejectedValue(new Error("Test error"));
            yield expect(class_service_1.default.isActive(1)).rejects.toThrow("Error checking if class is active");
        }));
    });
    describe("deleteClass", () => {
        it("should delete a class", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.destroy.mockResolvedValue(1);
            const result = yield class_service_1.default.deleteClass(1);
            expect(classes_model_1.default.destroy).toHaveBeenCalledWith({ where: { class_id: 1 } });
            expect(result.message).toBe("Class deleted successfully");
        }));
        it("should throw an error if class not found", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.destroy.mockResolvedValue(0);
            yield expect(class_service_1.default.deleteClass(1)).rejects.toThrow("Class not found");
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.destroy.mockRejectedValue(new Error("Test error"));
            yield expect(class_service_1.default.deleteClass(1)).rejects.toThrow("Error deleting class");
        }));
    });
    describe("getClassByModuleId", () => {
        it("should return classes by module ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockClasses = [
                {
                    dataValues: {
                        class_id: 1,
                        class_name: "Math 101",
                        instructor: "Mr. A",
                        schedule: "Mon-Wed",
                    },
                },
            ];
            classes_model_1.default.findAll.mockResolvedValue(mockClasses);
            const result = yield class_service_1.default.getClassByModuleId(1);
            expect(classes_model_1.default.findAll).toHaveBeenCalledWith({
                where: { module_id: 1 },
                order: [["class_id", "ASC"]],
            });
            expect(result).toEqual([mockClasses[0].dataValues]);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            classes_model_1.default.findAll.mockRejectedValue(new Error("Test error"));
            yield expect(class_service_1.default.getClassByModuleId(1)).rejects.toThrow("Error fetching classes by module ID");
        }));
    });
});
//# sourceMappingURL=class.service.test.js.map