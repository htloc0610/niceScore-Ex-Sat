import { Model, DataTypes } from 'sequelize';
import sequelize from "../config/db";

export class ClassRegistration extends Model {
    public registration_id!: number;
    public student_id!: number;
    public class_id!: number;
}

ClassRegistration.init(
    {
        registration_id: {
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
    },
    {
        sequelize,
        tableName: 'class_registrations',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['student_id', 'class_id'],
            },
        ],
    }
);

export default ClassRegistration;