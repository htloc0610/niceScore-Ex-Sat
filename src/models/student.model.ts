import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Faculty from "./faculty.model";

class Student extends Model {
  public student_id!: number;
  public full_name!: string;
  public date_of_birth!: Date;
  public gender!: string;
  public faculty_id!: number; // Liên kết với Faculty
  public course!: string;
  public program!: string;
  public address!: string;
  public email!: string;
  public phone_number!: string;
  public status!: string;
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
    course: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    program: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
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
    status: {
      type: DataTypes.ENUM(
        "Đang học",
        "Đã tốt nghiệp",
        "Đã thôi học",
        "Tạm dừng học"
      ),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "students",
    timestamps: false,
  }
);

// Thiết lập quan hệ giữa Student và Faculty
Student.belongsTo(Faculty, { foreignKey: "faculty_id" });
Faculty.hasMany(Student, { foreignKey: "faculty_id" });

export default Student;
