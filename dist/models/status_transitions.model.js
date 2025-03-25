"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class StatusTransition extends sequelize_1.Model {
}
StatusTransition.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    current_status: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    new_status: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    modelName: "StatusTransition",
    tableName: "status_transitions",
    timestamps: false,
});
exports.default = StatusTransition;
//# sourceMappingURL=status_transitions.model.js.map