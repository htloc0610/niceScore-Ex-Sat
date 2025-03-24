import Configuration from "../models/configurations.model";
import { logger } from "../config/logger";

const configurationService = {
  getConfiguration: async (configName: string) => {
    try {
      const config = await Configuration.findOne({
        where: {  config_key: configName }
      });
      return config.dataValues;
    } catch (error) {
      logger.error("Error getting configuration: " + error.message);
      console.error("Error getting configuration:", error);
      throw error;
    };
  },
  configureConfiguration: async (configData: {
    name: string;
    value: string;
  }) => {
    try {
      const newConfig = await Configuration.create(configData);
      return newConfig;
    } catch (error) {
      logger.error("Error configuring: " + error.message);
      console.error("Error configuring:", error);
      throw error;
    };
  },
  addConfiguration: async (configData: {
    name: string;
    value: string;
  }) => {
    try {
      const newConfig = await Configuration.create(configData);
      return newConfig;
    } catch (error) {
      logger.error("Error adding configuration: " + error.message);
      console.error("Error adding configuration:", error);
      throw error;
    }
  },
};

export default configurationService;
