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
const class_cancellation_service_1 = __importDefault(require("../../src/services/class_cancellation.service"));
const registration_cancellations_model_1 = __importDefault(require("../../src/models/registration_cancellations.model"));
jest.mock("../../src/models/registration_cancellations.model");
describe("classCancellationService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("getAllCancellations", () => {
        it("should return list of all cancellations", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = [
                {
                    get: jest.fn().mockReturnValue({
                        cancellation_id: 1,
                        student: {
                            student_id: 101,
                            full_name: "Alice",
                            email: "alice@example.com",
                        },
                        class: { class_id: 201, class_name: "Math", module_id: "MATH01" },
                    }),
                },
            ];
            registration_cancellations_model_1.default.findAll.mockResolvedValue(mockData);
            const result = yield class_cancellation_service_1.default.getAllCancellations();
            expect(result).toEqual([
                {
                    cancellation_id: 1,
                    student: {
                        student_id: 101,
                        full_name: "Alice",
                        email: "alice@example.com",
                    },
                    class: { class_id: 201, class_name: "Math", module_id: "MATH01" },
                },
            ]);
            expect(registration_cancellations_model_1.default.findAll).toHaveBeenCalledTimes(1);
        }));
        it("should throw error if fetching fails", () => __awaiter(void 0, void 0, void 0, function* () {
            registration_cancellations_model_1.default.findAll.mockRejectedValue(new Error("DB error"));
            yield expect(class_cancellation_service_1.default.getAllCancellations()).rejects.toThrow("Error fetching all cancellations");
        }));
    });
    describe("getCancellationDetails", () => {
        it("should return cancellations filtered by module ID", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockData = [
                {
                    get: jest.fn().mockReturnValue({
                        cancellation_id: 2,
                        student: {
                            student_id: 102,
                            full_name: "Bob",
                            email: "bob@example.com",
                        },
                        class: {
                            class_id: 202,
                            class_name: "Physics",
                            module_id: "PHYS01",
                            instructor: "Dr. Smith",
                            schedule: "Mon-Wed",
                            classroom: "Room 1",
                            academic_year: "2024-2025",
                        },
                    }),
                },
            ];
            registration_cancellations_model_1.default.findAll.mockResolvedValue(mockData);
            const result = yield class_cancellation_service_1.default.getCancellationDetails("PHYS01");
            expect(result).toEqual([
                {
                    cancellation_id: 2,
                    student: {
                        student_id: 102,
                        full_name: "Bob",
                        email: "bob@example.com",
                    },
                    class: {
                        class_id: 202,
                        class_name: "Physics",
                        module_id: "PHYS01",
                        instructor: "Dr. Smith",
                        schedule: "Mon-Wed",
                        classroom: "Room 1",
                        academic_year: "2024-2025",
                    },
                },
            ]);
            expect(registration_cancellations_model_1.default.findAll).toHaveBeenCalledTimes(1);
        }));
        it("should throw error if fetching by module ID fails", () => __awaiter(void 0, void 0, void 0, function* () {
            registration_cancellations_model_1.default.findAll.mockRejectedValue(new Error("DB error"));
            yield expect(class_cancellation_service_1.default.getCancellationDetails("INVALID01")).rejects.toThrow("Error fetching cancellations for the specified module ID");
        }));
    });
});
//# sourceMappingURL=class_cancellation.service.test.js.map