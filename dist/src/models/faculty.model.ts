import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Faculty extends Model {
  public faculty_id!: number;
  public name!: string;
}

Faculty.init(
  {
    faculty_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "faculties",
    timestamps: false,
  }
);

export default Faculty;
