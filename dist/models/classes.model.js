"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Class = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Class extends sequelize_1.Model {
}
exports.Class = Class;
Class.init({
    class_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    module_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    academic_year: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    semester: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    instructor: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    max_students: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
        },
    },
    schedule: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    classroom: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    tableName: 'classes',
    timestamps: false,
});
exports.default = Class;
//# sourceMappingURL=classes.model.js.map