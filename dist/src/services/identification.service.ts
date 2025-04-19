import Identification from "../models/identification.model";
import {logger} from "../config/logger";

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
      logger.error("Error adding identification: " + error.message);
      console.error("Error adding identification:", error);
      throw error;
    }
  },
  updateIdentification: async (identificationId: number, identificationData: {
    type?: string;
    number?: string;
    issue_date?: string;
    expiry_date?: string;
    place_of_issue?: string;
    country_of_issue?: string;
    has_chip?: boolean;
    notes?: string;
  }) => {
    try {
      const identification = await Identification.findByPk(identificationId);
      if (!identification) {
        throw new Error("Identification not found");
      }
      await identification.update(identificationData);
      return identification;
    } catch (error) {
      logger.error("Error updating identification: " + error.message);
      console.error("Error updating identification:", error);
      throw error;
    }
  },
};

export default identificationService;
