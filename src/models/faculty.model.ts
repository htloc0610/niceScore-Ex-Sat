import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Faculty extends Model {
  public faculty_id!: number;
  public name_vi!: string;
  public name_en!: string;
}

Faculty.init(
  {
    faculty_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name_vi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },  {
    sequelize,
    tableName: "faculties",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['name_vi'],
      },
      {
        unique: true,
        fields: ['name_en'],
      },
    ],
  }
);

export default Faculty;
