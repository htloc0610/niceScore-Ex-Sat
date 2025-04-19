import { Request, Response } from "express";
import configurationService from "../services/configurations.service";
import { logger } from "../config/logger";

const statusController = {
  getListConfigurations: async (req: Request, res: Response): Promise<void> => {
    try {
      const configurations = await configurationService.getAllConfiguration();
      logger.info("Fetched list of configurations successfully");
      res.send({ message: "List of configurations", configurations });
    } catch (error) {
      logger.error("An error occurred while fetching configurations", error);
      res
        .status(500)
        .send({ message: "An error occurred while fetching configurations." });
    }
  },
    updateConfiguration: async (req: Request, res: Response): Promise<void> => {
      try {
        const { config_key, config_value } = req.body;
        const data = { config_key, config_value };
        const updatedConfiguration = await configurationService.updateConfiguration(data);
        if (updatedConfiguration) {
          logger.info(`Configuration updated successfully`);
          res.send({ message: "Configuration updated successfully", updatedConfiguration });
        } else {
          logger.error(`Configuration not found`);
          res.status(404).send({ message: "Configuration not found" });
        }
      } catch (error) {
        logger.error("An error occurred while updating the configuration", error);
        res
          .status(500)
          .send({ message: "An error occurred while updating the configuration." });
      }
    },
  addConfiguration: async (req: Request, res: Response): Promise<void> => {
    try {
      const data = req.body;
      const newStatus = await configurationService.addConfiguration(data);
      logger.info("Status added successfully");
      res.status(201).send({ message: "Status added successfully", newStatus });
    } catch (error) {
      logger.error("An error occurred while adding the status", error);
      res
        .status(500)
        .send({ message: "An error occurred while adding the status." });
    }
  },
};

export default statusController;
