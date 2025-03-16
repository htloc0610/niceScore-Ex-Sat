"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Identification extends sequelize_1.Model {
}
Identification.init({
    identification_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    type: {
        type: sequelize_1.DataTypes.ENUM("CMND", "CCCD", "Passport"),
        allowNull: false,
    },
    number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    issue_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    expiry_date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    place_of_issue: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    country_of_issue: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    has_chip: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: db_1.default,
    tableName: "identifications",
    timestamps: false,
});
exports.default = Identification;
//# sourceMappingURL=identification.model.js.map