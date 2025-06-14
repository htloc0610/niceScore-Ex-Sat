"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Faculty extends sequelize_1.Model {
}
Faculty.init({
    faculty_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name_vi: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    name_en: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    tableName: "faculties",
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['name_vi'],
        },
        {
            unique: true,
            fields: ['name_en'],
        },
    ],
});
exports.default = Faculty;
//# sourceMappingURL=faculty.model.js.map