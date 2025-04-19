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
const address_service_1 = __importDefault(require("../../src/services/address.service"));
const address_model_1 = __importDefault(require("../../src/models/address.model"));
jest.mock("../../src/models/address.model");
describe("addressService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("addAddress", () => {
        it("should create a new address", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAddressData = {
                house_number: "123",
                street_name: "Main St",
                city: "Hanoi",
            };
            const mockCreated = Object.assign({ id: 1 }, mockAddressData);
            address_model_1.default.create.mockResolvedValue(mockCreated);
            const result = yield address_service_1.default.addAddress(mockAddressData);
            expect(address_model_1.default.create).toHaveBeenCalledWith(mockAddressData);
            expect(result).toEqual(mockCreated);
        }));
        it("should throw an error if create fails", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error("DB error");
            address_model_1.default.create.mockRejectedValue(mockError);
            yield expect(address_service_1.default.addAddress({ city: "Hanoi" })).rejects.toThrow("DB error");
        }));
    });
    describe("updateAddress", () => {
        it("should update an existing address", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAddress = {
                update: jest.fn().mockResolvedValue(true),
            };
            address_model_1.default.findByPk.mockResolvedValue(mockAddress);
            const addressId = 1;
            const updateData = { city: "Saigon" };
            const result = yield address_service_1.default.updateAddress(addressId, updateData);
            expect(address_model_1.default.findByPk).toHaveBeenCalledWith(addressId);
            expect(mockAddress.update).toHaveBeenCalledWith(updateData);
            expect(result).toBe(mockAddress);
        }));
        it("should throw error if address not found", () => __awaiter(void 0, void 0, void 0, function* () {
            address_model_1.default.findByPk.mockResolvedValue(null);
            yield expect(address_service_1.default.updateAddress(99, { city: "Hue" })).rejects.toThrow("Address not found");
        }));
        it("should throw error if update fails", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAddress = {
                update: jest.fn().mockRejectedValue(new Error("Update failed")),
            };
            address_model_1.default.findByPk.mockResolvedValue(mockAddress);
            yield expect(address_service_1.default.updateAddress(1, { city: "Can Tho" })).rejects.toThrow("Update failed");
        }));
    });
});
//# sourceMappingURL=address.service.test.js.map