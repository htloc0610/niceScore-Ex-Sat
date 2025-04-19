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
// tests/services/class_registation.service.test.ts
const class_registation_service_1 = __importDefault(require("../../src/services/class_registation.service"));
const class_registrations_model_1 = __importDefault(require("../../src/models/class_registrations.model"));
jest.mock("../../src/models/class_registrations.model");
jest.mock("../../src/models/student.model");
jest.mock("../../src/models/classes.model");
describe("classRegistationService.getAllRegistrations", () => {
    it("should return all registrations with student and class info", () => __awaiter(void 0, void 0, void 0, function* () {
        const mockData = [
            {
                dataValues: {
                    registration_id: 1,
                    student: {
                        student_id: 101,
                        full_name: "John Doe",
                        email: "john@example.com",
                    },
                    class: {
                        class_id: 201,
                        class_name: "Math",
                        academic_year: "2024",
                        module_id: 1,
                        instructor: "Mr. A",
                        schedule: "Mon-Wed",
                        classroom: "101A",
                    },
                },
            },
        ];
        class_registrations_model_1.default.findAll.mockResolvedValue(mockData);
        const result = yield class_registation_service_1.default.getAllRegistrations();
        expect(class_registrations_model_1.default.findAll).toHaveBeenCalled();
        expect(result).toEqual([mockData[0].dataValues]);
    }));
});
//# sourceMappingURL=class_registation.service.test.js.map