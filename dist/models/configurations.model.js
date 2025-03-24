"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Configuration extends sequelize_1.Model {
}
Configuration.init({
    config_key: {
        type: sequelize_1.DataTypes.STRING(255),
        primaryKey: true,
    },
    config_value: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    modelName: 'Configuration',
    tableName: 'configurations',
    timestamps: false,
});
exports.default = Configuration;
//# sourceMappingURL=configurations.model.js.map