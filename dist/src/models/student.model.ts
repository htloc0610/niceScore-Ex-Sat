import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Faculty from "./faculty.model";
import Status from "./status.model";
import Address from "./address.model";
import Identification from "./identification.model";
import Course from "./course.model"; // Import Course

class Student extends Model {
  public student_id!: number;
  public full_name!: string;
  public date_of_birth!: Date;
  public gender!: string;
  public faculty_id!: number;
  public course_id!: number; // Thay vì string, dùng khóa ngoại
  public program!: string;
  public email!: string;
  public phone_number!: string;
  public status_id!: number;
  public permanent_address_id!: number;
  public temporary_address_id!: number;
  public mailing_address_id!: number;
  public identification_id!: number;
  public nationality!: string;
}

Student.init(
  {
    student_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("Nam", "Nữ", "Khác"),
      allowNull: false,
    },
    faculty_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Faculty,
        key: "faculty_id",
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Course, // Liên kết với bảng Course
        key: "course_id",
      },
    },
    program: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Status,
        key: "status_id",
      },
    },
    permanent_address_id: {
      type: DataTypes.INTEGER,
      references: { model: Address, key: "address_id" },
    },
    temporary_address_id: {
      type: DataTypes.INTEGER,
      references: { model: Address, key: "address_id" },
    },
    mailing_address_id: {
      type: DataTypes.INTEGER,
      references: { model: Address, key: "address_id" },
    },
    identification_id: {
      type: DataTypes.INTEGER,
      references: { model: Identification, key: "identification_id" },
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "students",
    timestamps: false,
  }
);

export default Student;
