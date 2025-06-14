import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";
import Module from "./modules.model";

export class ModuleTranslation extends Model {
    public id!: number;
    public module_id!: number;
    public language!: string;
    public module_name!: string;
    public description?: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

ModuleTranslation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        module_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'modules',
                key: 'module_id',
            },
        },
        language: {
            type: DataTypes.STRING(10),
            allowNull: false,
            comment: 'ISO 639-1 language code (e.g., "en", "vi", "fr")'
        },
        module_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at'
        },
    },
    {
        sequelize,
        modelName: 'ModuleTranslation',
        tableName: 'module_translations',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['module_id', 'language'],
                name: 'module_translation_unique'
            }
        ]
    }
);

// Note: The actual associations are set up in realation.ts
// to avoid duplicate associations

export default ModuleTranslation;
