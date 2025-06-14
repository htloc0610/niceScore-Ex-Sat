"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleTranslation = void 0;
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../config/db"));
class ModuleTranslation extends sequelize_1.Model {
}
exports.ModuleTranslation = ModuleTranslation;
ModuleTranslation.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    module_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'modules',
            key: 'module_id',
        },
    },
    language: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        comment: 'ISO 639-1 language code (e.g., "en", "vi", "fr")'
    },
    module_name: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        field: 'created_at'
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        field: 'updated_at'
    },
}, {
    sequelize: db_1.default,
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
});
// Note: The actual associations are set up in realation.ts
// to avoid duplicate associations
exports.default = ModuleTranslation;
//# sourceMappingURL=module_translations.model.js.map