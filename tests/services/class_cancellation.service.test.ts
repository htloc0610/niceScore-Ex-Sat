import classCancellationService from "../../src/services/class_cancellation.service";
import RegistrationCancellation from "../../src/models/registration_cancellations.model";

jest.mock("../../src/models/registration_cancellations.model");

describe("classCancellationService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllCancellations", () => {
    it("should return list of all cancellations", async () => {
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
      (RegistrationCancellation.findAll as jest.Mock).mockResolvedValue(
        mockData
      );

      const result = await classCancellationService.getAllCancellations();

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
      expect(RegistrationCancellation.findAll).toHaveBeenCalledTimes(1);
    });

    it("should throw error if fetching fails", async () => {
      (RegistrationCancellation.findAll as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await expect(
        classCancellationService.getAllCancellations()
      ).rejects.toThrow("Error fetching all cancellations");
    });
  });

  describe("getCancellationDetails", () => {
    it("should return cancellations filtered by module ID", async () => {
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
      (RegistrationCancellation.findAll as jest.Mock).mockResolvedValue(
        mockData
      );

      const result = await classCancellationService.getCancellationDetails(
        "PHYS01"
      );

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
      expect(RegistrationCancellation.findAll).toHaveBeenCalledTimes(1);
    });

    it("should throw error if fetching by module ID fails", async () => {
      (RegistrationCancellation.findAll as jest.Mock).mockRejectedValue(
        new Error("DB error")
      );

      await expect(
        classCancellationService.getCancellationDetails("INVALID01")
      ).rejects.toThrow(
        "Error fetching cancellations for the specified module ID"
      );
    });
  });
});
