import { DataTypes, Model } from 'sequelize';
import sequelize from "../config/db";

class StatusTransition extends Model {
    public current_status!: string;
    public new_status!: string;
}

StatusTransition.init(
    {
        current_status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
            onDelete: 'CASCADE',
        },
        new_status: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: 'StatusTransition',
        tableName: 'status_transitions',
        timestamps: false,
    }
);

export default StatusTransition;