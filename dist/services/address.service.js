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
const address_model_1 = __importDefault(require("../models/address.model")); // Adjust the import path as necessary
const logger_1 = require("../config/logger");
const addressService = {
    addAddress: (addressData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newAddress = yield address_model_1.default.create(addressData);
            return newAddress;
        }
        catch (error) {
            logger_1.logger.error("Error adding address: " + error.message);
            console.error("Error adding address:", error);
            throw error;
        }
    }),
    updateAddress: (addressId, addressData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const address = yield address_model_1.default.findByPk(addressId);
            if (!address) {
                throw new Error("Address not found");
            }
            yield address.update(addressData);
            return address;
        }
        catch (error) {
            logger_1.logger.error("Error updating address: " + error.message);
            console.error("Error updating address:", error);
            throw error;
        }
    }),
};
exports.default = addressService;
//# sourceMappingURL=address.service.js.map