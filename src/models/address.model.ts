import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Address extends Model {
  public address_id!: number;
  public student_id!: number;
  public house_number!: string;
  public street_name!: string;
  public ward!: string;
  public district!: string;
  public city!: string;
  public country!: string;
}

Address.init(
  {
    address_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    house_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    street_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ward: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "addresses",
    timestamps: false,
  }
);

export default Address;
