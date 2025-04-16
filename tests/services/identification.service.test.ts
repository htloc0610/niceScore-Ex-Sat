import identificationService from "../../src/services/identification.service";
import Identification from "../../src/models/identification.model";

jest.mock("../../src/models/identification.model");
jest.mock("../../src/config/logger", () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe("identificationService", () => {
  describe("addIdentification", () => {
    it("should successfully add a new identification", async () => {
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
        dataValues: { ...identificationData },
        toJSON: jest.fn().mockReturnValue(identificationData),
      };

      (Identification.create as jest.Mock).mockResolvedValue(
        mockNewIdentification
      );

      const result = await identificationService.addIdentification(
        identificationData
      );

      expect(Identification.create).toHaveBeenCalledWith(identificationData);
      expect(result).toEqual(mockNewIdentification);
    });

    it("should handle errors", async () => {
      const identificationData = {
        type: "CCCD",
        number: "987654321",
        issue_date: "2021-01-01",
        expiry_date: "2031-01-01",
        place_of_issue: "Ho Chi Minh City",
        country_of_issue: "Vietnam",
        has_chip: true,
      };

      (Identification.create as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await expect(
        identificationService.addIdentification(identificationData)
      ).rejects.toThrow("Test error");
    });
  });

  describe("updateIdentification", () => {
    it("should successfully update an existing identification", async () => {
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

      const mockIdentification = {
        identification_id: identificationId,
        ...identificationData,
        update: jest.fn().mockResolvedValue(true),
      };

      (Identification.findByPk as jest.Mock).mockResolvedValue(
        mockIdentification
      );

      const result = await identificationService.updateIdentification(
        identificationId,
        identificationData
      );

      expect(Identification.findByPk).toHaveBeenCalledWith(identificationId);
      expect(mockIdentification.update).toHaveBeenCalledWith(
        identificationData
      );
      expect(result).toEqual(mockIdentification);
    });

    it("should throw an error if identification is not found", async () => {
      const identificationId = 1;
      const identificationData = { type: "Passport" };

      (Identification.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(
        identificationService.updateIdentification(
          identificationId,
          identificationData
        )
      ).rejects.toThrow("Identification not found");
    });

    it("should handle errors when updating identification", async () => {
      const identificationId = 1;
      const identificationData = { type: "Passport" };

      const mockIdentification = {
        identification_id: identificationId,
        update: jest.fn().mockRejectedValue(new Error("Test error")),
      };

      (Identification.findByPk as jest.Mock).mockResolvedValue(
        mockIdentification
      );

      await expect(
        identificationService.updateIdentification(
          identificationId,
          identificationData
        )
      ).rejects.toThrow("Test error");
    });
  });
});
