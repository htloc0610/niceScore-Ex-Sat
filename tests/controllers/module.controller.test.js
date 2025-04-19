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
const module_controller_1 = __importDefault(require("../../src/controllers/module.controller"));
const module_service_1 = __importDefault(require("../../src/services/module.service"));
const logger_1 = require("../../src/config/logger");
// Mock service và logger
jest.mock("../../src/services/module.service");
jest.mock("../../src/config/logger");
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
};
describe("moduleController - Module operations", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getListModules", () => {
        it("should return list of modules on success", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockModules = [
                { id: 1, name: "Mathematics", credits: 3 },
                { id: 2, name: "Physics", credits: 4 },
            ];
            module_service_1.default.getAllModules.mockResolvedValue(mockModules);
            const req = {};
            const res = mockResponse();
            yield module_controller_1.default.getListModules(req, res);
            expect(module_service_1.default.getAllModules).toHaveBeenCalled();
            expect(logger_1.logger.info).toHaveBeenCalledWith("Successfully fetched modules list");
            expect(res.send).toHaveBeenCalledWith({
                message: "List of modules",
                modules: mockModules,
            });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Database error");
            module_service_1.default.getAllModules.mockRejectedValue(error);
            const req = {};
            const res = mockResponse();
            yield module_controller_1.default.getListModules(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith("Error fetching modules list");
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while fetching modules.",
            });
        }));
    });
    describe("addModule", () => {
        it("should add module successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const newModuleData = { name: "Chemistry", credits: 3 };
            const mockNewModule = Object.assign({ id: 3 }, newModuleData);
            module_service_1.default.addModule.mockResolvedValue(mockNewModule);
            const req = { body: newModuleData };
            const res = mockResponse();
            yield module_controller_1.default.addModule(req, res);
            expect(module_service_1.default.addModule).toHaveBeenCalledWith(newModuleData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith({
                message: "Module added successfully",
                newModule: mockNewModule,
            });
        }));
        it("should return 400 if credits are less than 2", () => __awaiter(void 0, void 0, void 0, function* () {
            const newModuleData = { name: "Chemistry", credits: 1 };
            const req = { body: newModuleData };
            const res = mockResponse();
            yield module_controller_1.default.addModule(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith({
                message: "Credits must be at least 2.",
            });
        }));
        it("should handle errors when adding module", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Error adding module");
            module_service_1.default.addModule.mockRejectedValue(error);
            const req = { body: { name: "Chemistry", credits: 3 } };
            const res = mockResponse();
            yield module_controller_1.default.addModule(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while adding the module.",
            });
        }));
    });
});
//# sourceMappingURL=module.controller.test.js.map