// tests/services/configuration.service.test.ts
import configurationService from "../../src/services/configurations.service";
import Configuration from "../../src/models/configurations.model";

jest.mock("../../src/models/configurations.model");

describe("configurationService", () => {
  describe("getAllConfiguration", () => {
    it("should return all configurations", async () => {
      const mockConfigs = [
        {
          dataValues: {
            config_key: "app_name",
            config_value: "MyApp",
          },
        },
      ];

      (Configuration.findAll as jest.Mock).mockResolvedValue(mockConfigs);

      const result = await configurationService.getAllConfiguration();

      expect(Configuration.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockConfigs[0].dataValues]);
    });

    it("should handle errors", async () => {
      (Configuration.findAll as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await expect(configurationService.getAllConfiguration()).rejects.toThrow(
        "Test error"
      );
    });
  });

  describe("getConfiguration", () => {
    it("should return a configuration by key", async () => {
      const mockConfig = {
        dataValues: {
          config_key: "app_name",
          config_value: "MyApp",
        },
      };

      (Configuration.findOne as jest.Mock).mockResolvedValue(mockConfig);

      const result = await configurationService.getConfiguration("app_name");

      expect(Configuration.findOne).toHaveBeenCalledWith({
        where: { config_key: "app_name" },
      });
      expect(result).toEqual(mockConfig.dataValues);
    });

    it("should handle errors", async () => {
      (Configuration.findOne as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await expect(
        configurationService.getConfiguration("app_name")
      ).rejects.toThrow("Test error");
    });
  });

  describe("configureConfiguration", () => {
    it("should create a new configuration", async () => {
      const configData = { name: "app_name", value: "MyApp" };

      (Configuration.create as jest.Mock).mockResolvedValue(configData);

      const result = await configurationService.configureConfiguration(
        configData
      );

      expect(Configuration.create).toHaveBeenCalledWith(configData);
      expect(result).toEqual(configData);
    });

    it("should handle errors", async () => {
      const configData = { name: "app_name", value: "MyApp" };

      (Configuration.create as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await expect(
        configurationService.configureConfiguration(configData)
      ).rejects.toThrow("Test error");
    });
  });

  describe("addConfiguration", () => {
    it("should add a new configuration", async () => {
      const configData = { name: "app_version", value: "1.0" };

      (Configuration.create as jest.Mock).mockResolvedValue(configData);

      const result = await configurationService.addConfiguration(configData);

      expect(Configuration.create).toHaveBeenCalledWith(configData);
      expect(result).toEqual(configData);
    });

    it("should handle errors", async () => {
      const configData = { name: "app_version", value: "1.0" };

      (Configuration.create as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await expect(
        configurationService.addConfiguration(configData)
      ).rejects.toThrow("Test error");
    });
  });

  describe("updateConfiguration", () => {
    it("should update an existing configuration", async () => {
      const configData = { config_key: "app_version", config_value: "1.1" };

      const mockExistingConfig = {
        dataValues: {
          config_key: "app_version",
          config_value: "1.0",
        },
      };

      (Configuration.findOne as jest.Mock).mockResolvedValue(
        mockExistingConfig
      );
      (Configuration.update as jest.Mock).mockResolvedValue([
        1,
        [{ dataValues: { ...configData } }],
      ]);

      const result = await configurationService.updateConfiguration(configData);

      expect(Configuration.findOne).toHaveBeenCalledWith({
        where: { config_key: "app_version" },
      });
      expect(Configuration.update).toHaveBeenCalledWith(
        { config_value: "1.1" },
        { where: { config_key: "app_version" }, returning: true }
      );
      expect(result).toEqual(configData);
    });

    it("should return null if configuration not found", async () => {
      const configData = {
        config_key: "non_existing_key",
        config_value: "1.1",
      };

      (Configuration.findOne as jest.Mock).mockResolvedValue(null);

      const result = await configurationService.updateConfiguration(configData);

      expect(result).toBeNull();
    });

    it("should handle errors", async () => {
      const configData = { config_key: "app_version", config_value: "1.1" };

      (Configuration.findOne as jest.Mock).mockRejectedValue(
        new Error("Test error")
      );

      await expect(
        configurationService.updateConfiguration(configData)
      ).rejects.toThrow("Test error");
    });
  });
});
