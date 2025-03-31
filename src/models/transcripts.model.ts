import { Model, DataTypes } from 'sequelize';
import sequelize from "../config/db";

export class Transcript extends Model {
    public transcript_id!: number;
    public student_id!: number;
    public class_id!: number;
    public grade!: number | null;
}

Transcript.init(
    {
        transcript_id: {
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
        grade: {
            type: DataTypes.DECIMAL(4, 2),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'transcripts',
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ['student_id', 'class_id'],
            },
        ],
    }
);

export default Transcript;