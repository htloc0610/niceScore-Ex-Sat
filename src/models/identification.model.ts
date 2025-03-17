import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class Identification extends Model {
  public identification_id!: number;
  public student_id!: number;
  public type!: string; // CMND, CCCD, Passport
  public number!: string;
  public issue_date!: Date;
  public expiry_date!: Date;
  public place_of_issue!: string;
  public country_of_issue!: string;
  public has_chip?: boolean; // Chỉ áp dụng cho CCCD
  public notes?: string; // Ghi chú nếu có
}

Identification.init(
  {
    identification_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("CMND", "CCCD", "Passport"),
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    issue_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    place_of_issue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country_of_issue: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    has_chip: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "identifications",
    timestamps: false,
  }
);

export default Identification;
