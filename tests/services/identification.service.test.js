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
const identification_service_1 = __importDefault(require("../../src/services/identification.service"));
const identification_model_1 = __importDefault(require("../../src/models/identification.model"));
jest.mock("../../src/models/identification.model");
jest.mock("../../src/config/logger", () => ({
    logger: {
        error: jest.fn(),
        info: jest.fn(),
    },
}));
describe("identificationService", () => {
    describe("addIdentification", () => {
        it("should successfully add a new identification", () => __awaiter(void 0, void 0, void 0, function* () {
            const identificationData = {
                type: "CMND",
                number: "123456789",
                issue_date: "2020-01-01",
                expiry_date: "2030-01-01",
                place_of_issue: "Hanoi",
                country_of_issue: "Vietnam",
                has_chip: true,
                notes: "Test note",
            };
            const mockNewIdentification = {
                dataValues: Object.assign({}, identificationData),
                toJSON: jest.fn().mockReturnValue(identificationData),
            };
            identification_model_1.default.create.mockResolvedValue(mockNewIdentification);
            const result = yield identification_service_1.default.addIdentification(identificationData);
            expect(identification_model_1.default.create).toHaveBeenCalledWith(identificationData);
            expect(result).toEqual(mockNewIdentification);
        }));
        it("should handle errors", () => __awaiter(void 0, void 0, void 0, function* () {
            const identificationData = {
                type: "CCCD",
                number: "987654321",
                issue_date: "2021-01-01",
                expiry_date: "2031-01-01",
                place_of_issue: "Ho Chi Minh City",
                country_of_issue: "Vietnam",
                has_chip: true,
            };
            identification_model_1.default.create.mockRejectedValue(new Error("Test error"));
            yield expect(identification_service_1.default.addIdentification(identificationData)).rejects.toThrow("Test error");
        }));
    });
    describe("updateIdentification", () => {
        it("should successfully update an existing identification", () => __awaiter(void 0, void 0, void 0, function* () {
            const identificationId = 1;
            const identificationData = {
                type: "Passport",
                number: "A1234567",
                issue_date: "2022-01-01",
                expiry_date: "2032-01-01",
                place_of_issue: "Da Nang",
                country_of_issue: "Vietnam",
                has_chip: true,
                notes: "Updated note",
            };
            const mockIdentification = Object.assign(Object.assign({ identification_id: identificationId }, identificationData), { update: jest.fn().mockResolvedValue(true) });
            identification_model_1.default.findByPk.mockResolvedValue(mockIdentification);
            const result = yield identification_service_1.default.updateIdentification(identificationId, identificationData);
            expect(identification_model_1.default.findByPk).toHaveBeenCalledWith(identificationId);
            expect(mockIdentification.update).toHaveBeenCalledWith(identificationData);
            expect(result).toEqual(mockIdentification);
        }));
        it("should throw an error if identification is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            const identificationId = 1;
            const identificationData = { type: "Passport" };
            identification_model_1.default.findByPk.mockResolvedValue(null);
            yield expect(identification_service_1.default.updateIdentification(identificationId, identificationData)).rejects.toThrow("Identification not found");
        }));
        it("should handle errors when updating identification", () => __awaiter(void 0, void 0, void 0, function* () {
            const identificationId = 1;
            const identificationData = { type: "Passport" };
            const mockIdentification = {
                identification_id: identificationId,
                update: jest.fn().mockRejectedValue(new Error("Test error")),
            };
            identification_model_1.default.findByPk.mockResolvedValue(mockIdentification);
            yield expect(identification_service_1.default.updateIdentification(identificationId, identificationData)).rejects.toThrow("Test error");
        }));
    });
});
//# sourceMappingURL=identification.service.test.js.map