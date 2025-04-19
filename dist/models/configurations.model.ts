import { Model, DataTypes } from 'sequelize';
import sequelize from "../config/db";

class Configuration extends Model {
    public config_key!: string;
    public config_value!: string;
}

Configuration.init(
    {
        config_key: {
            type: DataTypes.STRING(255),
            primaryKey: true,
        },
        config_value: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Configuration',
        tableName: 'configurations',
        timestamps: false,
    }
);

export default Configuration;