"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Module extends sequelize_1.Model {
}
exports.Module = Module;
Module.init({
    module_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    module_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    credits: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 2,
        },
    },
    faculty_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    },
    prerequisite_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize: db_1.default,
    modelName: 'Module',
    tableName: 'modules',
    timestamps: true,
});
exports.default = Module;
//# sourceMappingURL=modules.model.js.map