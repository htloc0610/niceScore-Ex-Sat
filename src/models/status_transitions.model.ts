import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

class StatusTransition extends Model {
  public current_status!: string;
  public new_status!: string;
}

StatusTransition.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    current_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    new_status: {
      type: DataTypes.STRING(50),
      allowNull: false,
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
