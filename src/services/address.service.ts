import Address from "../models/address.model"; // Adjust the import path as necessary

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
      console.error("Error adding address:", error);
      throw error;
    }
  },
};

export default addressService;
