// tests/services/class_registation.service.test.ts
import classRegistationService from "../../src/services/class_registation.service";
import ClassRegistration from "../../src/models/class_registrations.model";

jest.mock("../../src/models/class_registrations.model");
jest.mock("../../src/models/student.model");
jest.mock("../../src/models/classes.model");

describe("classRegistationService.getAllRegistrations", () => {
  it("should return all registrations with student and class info", async () => {
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

    (ClassRegistration.findAll as jest.Mock).mockResolvedValue(mockData);

    const result = await classRegistationService.getAllRegistrations();

    expect(ClassRegistration.findAll).toHaveBeenCalled();
    expect(result).toEqual([mockData[0].dataValues]);
  });
});
