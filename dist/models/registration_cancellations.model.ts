import { Model, DataTypes } from 'sequelize';
import sequelize from "../config/db";

export class RegistrationCancellation extends Model {
    public cancellation_id!: number;
    public student_id!: number;
    public class_id!: number;
    public reason!: string | null;
}

RegistrationCancellation.init(
    {
        cancellation_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        reason: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'registration_cancellations',
        timestamps: true,
    }
);

export default RegistrationCancellation;