"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const logger_1 = require("./logger");
const pg_1 = __importDefault(require("pg"));
require("dotenv/config");
const dialect = process.env.DB_DIALECT;
const VALID_DIALECTS = ["mysql", "postgres", "sqlite", "mssql"];
if (!VALID_DIALECTS.includes(dialect)) {
    throw new Error(`Invalid DB_DIALECT: ${dialect}`);
}
// Cấu hình kết nối
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, // Tên cơ sở dữ liệu
process.env.DB_USER, // Tên người dùng
process.env.DB_PASSWORD, // Mật khẩu
{
    host: process.env.DB_HOST, // Địa chỉ host (ví dụ: localhost)
    dialect: dialect, // Loại CSDL (ví dụ: mysql, postgres, sqlite, mssql)
    logging: (msg) => logger_1.dbLogger.info(msg), // Ghi log SQL queries
    dialectModule: pg_1.default,
    pool: {
        max: 5, // Số lượng kết nối tối đa
        min: 0, // Số lượng kết nối tối thiểu
        acquire: 30000, // Thời gian tối đa (ms) để kết nối
        idle: 10000, // Thời gian tối đa (ms) kết nối không sử dụng sẽ bị đóng
    },
    dialectOptions: {
        // ssl: {
        //   require: true,
        //   rejectUnauthorized: false, // Nếu cần kết nối với SSL
        // },
        ssl: true,
    },
});
exports.default = sequelize;
//# sourceMappingURL=db.js.map