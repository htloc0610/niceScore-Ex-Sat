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
const status_transitions_service_1 = __importDefault(require("../../src/services/status_transitions.service"));
const status_transitions_model_1 = __importDefault(require("../../src/models/status_transitions.model"));
jest.mock("../../src/models/status_transitions.model");
jest.mock("../../src/models/status.model");
jest.mock("../../src/config/logger", () => ({
    logger: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));
describe("statusTransitionService", () => {
    describe("checkStatusTransition", () => {
        it("should return true if a valid status transition exists", () => __awaiter(void 0, void 0, void 0, function* () {
            status_transitions_model_1.default.findOne.mockResolvedValue({});
            const result = yield status_transitions_service_1.default.checkStatusTransition(1, 2);
            expect(status_transitions_model_1.default.findOne).toHaveBeenCalledWith({
                where: { current_status: 1, new_status: 2 },
            });
            expect(result).toBe(true);
        }));
        it("should return false if a status transition does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            status_transitions_model_1.default.findOne.mockResolvedValue(null);
            const result = yield status_transitions_service_1.default.checkStatusTransition(1, 2);
            expect(result).toBe(false);
        }));
    });
    describe("getStatusTransitions", () => {
        it("should return all status transitions with current and new statuses", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockStatusTransitions = [
                {
                    currentStatus: { status_id: 1, name: "Pending" },
                    newStatus: { status_id: 2, name: "In Progress" },
                },
            ];
            status_transitions_model_1.default.findAll.mockResolvedValue(mockStatusTransitions);
            const result = yield status_transitions_service_1.default.getStatusTransitions();
            expect(result).toEqual(mockStatusTransitions);
        }));
    });
    describe("addStatusTransitions", () => {
        it("should add a new status transition", () => __awaiter(void 0, void 0, void 0, function* () {
            const currentStatus = 1;
            const newStatus = 2;
            const mockNewStatusTransition = {
                current_status: currentStatus,
                new_status: newStatus,
            };
            status_transitions_model_1.default.findOne.mockResolvedValue(null);
            status_transitions_model_1.default.create.mockResolvedValue(mockNewStatusTransition);
            const result = yield status_transitions_service_1.default.addStatusTransitions(currentStatus, newStatus);
            expect(status_transitions_model_1.default.create).toHaveBeenCalledWith({
                current_status: currentStatus,
                new_status: newStatus,
            });
            expect(result).toEqual(mockNewStatusTransition);
        }));
    });
    describe("deleteStatusTransitions", () => {
        it("should delete a status transition", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 1;
            status_transitions_model_1.default.findByPk.mockResolvedValue({
                destroy: jest.fn(),
            });
            const result = yield status_transitions_service_1.default.deleteStatusTransitions(id);
            expect(status_transitions_model_1.default.findByPk).toHaveBeenCalledWith(id);
            expect(result).toEqual({
                message: "Status transition deleted successfully",
            });
        }));
        it("should throw an error if status transition is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const id = 1;
            status_transitions_model_1.default.findByPk.mockResolvedValue(null);
            yield expect(status_transitions_service_1.default.deleteStatusTransitions(id)).rejects.toThrow("Status transition not found");
        }));
    });
});
//# sourceMappingURL=status-transition.service.test.js.map