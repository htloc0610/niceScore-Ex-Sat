import Configuration from "../models/configurations.model";
import { logger } from "../config/logger";

const configurationService = {
  getAllConfiguration: async () => {
    try {
      const configs = await Configuration.findAll();
      return configs.map(config => config.dataValues);
    } catch (error) {
      logger.error("Error getting all configurations: " + error.message);
      console.error("Error getting all configurations:", error);
      throw error;
    }
  },
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
      console.log("configData", configData);
      
      const newConfig = await Configuration.create(configData);
      return newConfig;
    } catch (error) {
      logger.error("Error adding configuration: " + error.message);
      console.error("Error adding configuration:", error);
      throw error;
    }
  },
  updateConfiguration: async (configData: { config_key: string; config_value: string }) => {
    try {
      const existingConfig = await Configuration.findOne({
        where: { config_key: configData.config_key }
      });
      if (!existingConfig) {
        return null;
      }
      const [numberOfAffectedRows, affectedRows] = await Configuration.update(
        { config_value: configData.config_value },
        { where: { config_key: configData.config_key }, returning: true }
      );
      const updatedConfig = affectedRows[0].dataValues;
      return updatedConfig;
    } catch (error) {
      logger.error("Error updating configuration: " + error.message);
      console.error("Error updating configuration:", error);
      throw error;
    }
  }
};

export default configurationService;
