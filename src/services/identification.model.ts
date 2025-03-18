import Identification from "../models/identification.model";

const identificationService = {
  addIdentification: async (identificationData: {
    type: string;
    number: string;
    issue_date: string;
    expiry_date: string;
    place_of_issue: string;
    country_of_issue: string;
    has_chip: boolean;
    notes?: string;
  }) => {
    try {
      const newIdentification = await Identification.create(identificationData);
      return newIdentification;
    } catch (error) {
      console.error("Error adding identification:", error);
      throw error;
    }
  },
};

export default identificationService;
