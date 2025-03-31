import { Model, DataTypes } from 'sequelize';
import sequelize from "../config/db";

export class Class extends Model {
    public class_id!: number;
    public module_id!: number;
    public academic_year!: string;
    public semester!: string;
    public instructor!: string;
    public max_students!: number;
    public schedule!: string;
    public classroom!: string;
}

Class.init(
    {
        class_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        module_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        academic_year: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        semester: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        instructor: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        max_students: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1,
            },
        },
        schedule: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        classroom: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'classes',
        timestamps: false,
    }
);

export default Class;