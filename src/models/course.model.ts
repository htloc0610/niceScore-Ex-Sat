import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Course extends Model {
  public course_id!: number;
  public course_name_en!: string;
  public course_name_vi!: string;
}

Course.init(
  {
    course_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    course_name_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    course_name_vi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "courses",
    timestamps: false,
  }
);

export default Course;
