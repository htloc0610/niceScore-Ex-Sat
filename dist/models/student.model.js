"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
const faculty_model_1 = __importDefault(require("./faculty.model"));
const status_model_1 = __importDefault(require("./status.model"));
const address_model_1 = __importDefault(require("./address.model"));
const identification_model_1 = __importDefault(require("./identification.model"));
const course_model_1 = __importDefault(require("./course.model")); // Import Course
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
    course_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: course_model_1.default, // Liên kết với bảng Course
            key: "course_id",
        },
    },
    program: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
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
    status_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: status_model_1.default,
            key: "status_id",
        },
    },
    permanent_address_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: address_model_1.default, key: "address_id" },
    },
    temporary_address_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: address_model_1.default, key: "address_id" },
    },
    mailing_address_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: address_model_1.default, key: "address_id" },
    },
    identification_id: {
        type: sequelize_1.DataTypes.INTEGER,
        references: { model: identification_model_1.default, key: "identification_id" },
    },
    nationality: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    tableName: "students",
    timestamps: false,
});
exports.default = Student;
//# sourceMappingURL=student.model.js.map