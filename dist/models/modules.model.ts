import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";

export class Module extends Model {
    public module_id!: number;
    public module_code!: string;
    public module_name!: string;
    public credits!: number;
    public faculty_id!: number;
    public description?: string;
    public prerequisite_id?: number;
    public is_active!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Module.init(
    {
        module_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        module_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        module_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        credits: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2,
            },
        },
        faculty_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        prerequisite_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: 'Module',
        tableName: 'modules',
        timestamps: true,
    }
);

export default Module;