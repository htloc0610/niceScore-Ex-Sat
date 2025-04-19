import Address from "../models/address.model"; // Adjust the import path as necessary
import { logger } from "../config/logger";

const addressService = {
  addAddress: async (addressData: {
    house_number?: string;
    street_name?: string;
    ward?: string;
    district?: string;
    city?: string;
    country?: string;
  }) => {
    try {
      const newAddress = await Address.create(addressData);
      return newAddress;
    } catch (error) {
      logger.error("Error adding address: " + error.message);
      console.error("Error adding address:", error);
      throw error;
    }
  },

  updateAddress: async (
    addressId: number,
    addressData: {
      house_number?: string;
      street_name?: string;
      ward?: string;
      district?: string;
      city?: string;
      country?: string;
    }
  ) => {
    try {
      const address = await Address.findByPk(addressId);
      if (!address) {
        throw new Error("Address not found");
      }
      await address.update(addressData);
      return address;
    } catch (error) {
      logger.error("Error updating address: " + error.message);
      console.error("Error updating address:", error);
      throw error;
    }
  },
};

export default addressService;
