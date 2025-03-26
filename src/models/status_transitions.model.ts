import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Status from "./status.model";

class StatusTransition extends Model {
  public id!: number;
  public current_status!: number;
  public new_status!: number;
}


StatusTransition.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    current_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Status,
        key: "status_id",
      },
    },
    new_status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Status,
        key: "status_id",
      },
    },
  },
  {
    sequelize,
    modelName: "StatusTransition",
    tableName: "status_transitions",
    timestamps: false,
  }
);

export default StatusTransition;
