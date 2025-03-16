"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Address extends sequelize_1.Model {
}
Address.init({
    address_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    house_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    street_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    ward: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    district: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    country: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize: db_1.default,
    tableName: "addresses",
    timestamps: false,
});
exports.default = Address;
//# sourceMappingURL=address.model.js.map