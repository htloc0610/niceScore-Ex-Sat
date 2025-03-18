import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Course extends Model {
  public course_id!: number;
  public course_name!: string;
}

Course.init(
  {
    course_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "courses",
    timestamps: false,
  }
);

export default Course;
