"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassRegistration = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class ClassRegistration extends sequelize_1.Model {
}
exports.ClassRegistration = ClassRegistration;
ClassRegistration.init({
    registration_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    student_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    class_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    tableName: 'class_registrations',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['student_id', 'class_id'],
        },
    ],
});
exports.default = ClassRegistration;
//# sourceMappingURL=class_registrations.model.js.map