import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Status extends Model {
  public status_id!: number;
  public name_vi!: string;
  public name_en!: string;
}

Status.init(
  {
    status_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name_vi: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name_en: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: "status",
    timestamps: false,
  }
);

export default Status;
