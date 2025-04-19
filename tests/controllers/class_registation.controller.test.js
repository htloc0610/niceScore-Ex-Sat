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
const class_cancellation_controller_1 = __importDefault(require("../../src/controllers/class_cancellation.controller"));
const class_cancellation_service_1 = __importDefault(require("../../src/services/class_cancellation.service"));
const logger_1 = require("../../src/config/logger");
// Mock service và logger
jest.mock("../../src/services/class_cancellation.service");
jest.mock("../../src/config/logger");
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    return res;
};
describe("classRegistationController", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getClassCancellationList", () => {
        it("should return list of cancellations on success", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockCancellations = [{ id: 1 }, { id: 2 }];
            class_cancellation_service_1.default.getAllCancellations.mockResolvedValue(mockCancellations);
            const req = {};
            const res = mockResponse();
            yield class_cancellation_controller_1.default.getClassCancellationList(req, res);
            expect(class_cancellation_service_1.default.getAllCancellations).toHaveBeenCalled();
            expect(logger_1.logger.info).toHaveBeenCalledWith("Successfully fetched class cancellation list");
            expect(res.send).toHaveBeenCalledWith({
                message: "List of class cancellations",
                cancellations: mockCancellations,
            });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const error = new Error("Database error");
            class_cancellation_service_1.default.getAllCancellations.mockRejectedValue(error);
            const req = {};
            const res = mockResponse();
            yield class_cancellation_controller_1.default.getClassCancellationList(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith("Error fetching class cancellation list", { error });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while fetching class cancellations.",
            });
        }));
    });
    describe("getClassCancellationDetails", () => {
        it("should return cancellation details when found", () => __awaiter(void 0, void 0, void 0, function* () {
            const moduleID = "123";
            const mockDetails = { moduleID, reason: "low attendance" };
            class_cancellation_service_1.default.getCancellationDetails.mockResolvedValue(mockDetails);
            const req = { params: { moduleID } };
            const res = mockResponse();
            yield class_cancellation_controller_1.default.getClassCancellationDetails(req, res);
            expect(class_cancellation_service_1.default.getCancellationDetails).toHaveBeenCalledWith(moduleID);
            expect(logger_1.logger.info).toHaveBeenCalledWith(`Successfully fetched cancellation details for moduleID: ${moduleID}`);
            expect(res.send).toHaveBeenCalledWith({
                message: `Cancellation details for moduleID: ${moduleID}`,
                cancellationDetails: mockDetails,
            });
        }));
        it("should return 404 when no details found", () => __awaiter(void 0, void 0, void 0, function* () {
            const moduleID = "123";
            class_cancellation_service_1.default.getCancellationDetails.mockResolvedValue(null);
            const req = { params: { moduleID } };
            const res = mockResponse();
            yield class_cancellation_controller_1.default.getClassCancellationDetails(req, res);
            expect(logger_1.logger.warn).toHaveBeenCalledWith(`No cancellation details found for moduleID: ${moduleID}`);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.send).toHaveBeenCalledWith({
                message: `No cancellation details found for moduleID: ${moduleID}`,
            });
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const moduleID = "123";
            const error = new Error("Unexpected error");
            class_cancellation_service_1.default.getCancellationDetails.mockRejectedValue(error);
            const req = { params: { moduleID } };
            const res = mockResponse();
            yield class_cancellation_controller_1.default.getClassCancellationDetails(req, res);
            expect(logger_1.logger.error).toHaveBeenCalledWith("Error fetching class cancellation details", { error });
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.send).toHaveBeenCalledWith({
                message: "An error occurred while fetching class cancellation details.",
            });
        }));
    });
});
//# sourceMappingURL=class_registation.controller.test.js.map