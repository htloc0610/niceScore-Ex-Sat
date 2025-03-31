"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transcript = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class Transcript extends sequelize_1.Model {
}
exports.Transcript = Transcript;
Transcript.init({
    transcript_id: {
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
    grade: {
        type: sequelize_1.DataTypes.DECIMAL(4, 2),
        allowNull: true,
    },
}, {
    sequelize: db_1.default,
    tableName: 'transcripts',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['student_id', 'class_id'],
        },
    ],
});
exports.default = Transcript;
//# sourceMappingURL=transcripts.model.js.map