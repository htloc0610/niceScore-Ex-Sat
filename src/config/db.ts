import { Sequelize, Dialect } from "sequelize";
import { dbLogger } from "./logger";
import pg from "pg";
import "dotenv/config";

const dialect = process.env.DB_DIALECT as Dialect;

const VALID_DIALECTS: Dialect[] = ["mysql", "postgres", "sqlite", "mssql"];

if (!VALID_DIALECTS.includes(dialect)) {
  throw new Error(`Invalid DB_DIALECT: ${dialect}`);
}

// Cấu hình kết nối
const sequelize = new Sequelize(
  process.env.DB_NAME as string, // Tên cơ sở dữ liệu
  process.env.DB_USER as string, // Tên người dùng
  process.env.DB_PASSWORD as string, // Mật khẩu
  {
    host: process.env.DB_HOST as string, // Địa chỉ host (ví dụ: localhost)
    dialect: dialect, // Loại CSDL (ví dụ: mysql, postgres, sqlite, mssql)
    logging: (msg) => dbLogger.info(msg), // Ghi log SQL queries
    dialectModule: pg,
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
      ssl: false,
    },
  }
);

export default sequelize;
