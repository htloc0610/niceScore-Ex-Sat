"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const faculty_model_1 = __importDefault(require("./faculty.model"));
class Student extends sequelize_1.Model {
}
Student.init({
    student_id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    full_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    date_of_birth: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM("Nam", "Nữ", "Khác"),
        allowNull: false,
    },
    faculty_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: faculty_model_1.default,
            key: "faculty_id",
        },
    },
    course: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    program: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM("Đang học", "Đã tốt nghiệp", "Đã thôi học", "Tạm dừng học"),
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    tableName: "students",
    timestamps: false,
});
// Thiết lập quan hệ giữa Student và Faculty
Student.belongsTo(faculty_model_1.default, { foreignKey: "faculty_id" });
faculty_model_1.default.hasMany(Student, { foreignKey: "faculty_id" });
exports.default = Student;
//# sourceMappingURL=student.model.js.map