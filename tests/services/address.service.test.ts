import addressService from "../../src/services/address.service";
import Address from "../../src/models/address.model";

jest.mock("../../src/models/address.model");

describe("addressService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addAddress", () => {
    it("should create a new address", async () => {
      const mockAddressData = {
        house_number: "123",
        street_name: "Main St",
        city: "Hanoi",
      };

      const mockCreated = { id: 1, ...mockAddressData };
      (Address.create as jest.Mock).mockResolvedValue(mockCreated);

      const result = await addressService.addAddress(mockAddressData);
      expect(Address.create).toHaveBeenCalledWith(mockAddressData);
      expect(result).toEqual(mockCreated);
    });

    it("should throw an error if create fails", async () => {
      const mockError = new Error("DB error");
      (Address.create as jest.Mock).mockRejectedValue(mockError);

      await expect(
        addressService.addAddress({ city: "Hanoi" })
      ).rejects.toThrow("DB error");
    });
  });

  describe("updateAddress", () => {
    it("should update an existing address", async () => {
      const mockAddress = {
        update: jest.fn().mockResolvedValue(true),
      };
      (Address.findByPk as jest.Mock).mockResolvedValue(mockAddress);

      const addressId = 1;
      const updateData = { city: "Saigon" };

      const result = await addressService.updateAddress(addressId, updateData);

      expect(Address.findByPk).toHaveBeenCalledWith(addressId);
      expect(mockAddress.update).toHaveBeenCalledWith(updateData);
      expect(result).toBe(mockAddress);
    });

    it("should throw error if address not found", async () => {
      (Address.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        addressService.updateAddress(99, { city: "Hue" })
      ).rejects.toThrow("Address not found");
    });

    it("should throw error if update fails", async () => {
      const mockAddress = {
        update: jest.fn().mockRejectedValue(new Error("Update failed")),
      };
      (Address.findByPk as jest.Mock).mockResolvedValue(mockAddress);

      await expect(
        addressService.updateAddress(1, { city: "Can Tho" })
      ).rejects.toThrow("Update failed");
    });
  });
});
