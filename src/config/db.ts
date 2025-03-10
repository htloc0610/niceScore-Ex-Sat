import { Sequelize, Dialect } from "sequelize";
import "dotenv/config";

// Cấu hình kết nối
const sequelize = new Sequelize(
  process.env.DB_NAME as string, // Tên cơ sở dữ liệu
  process.env.DB_USER as string, // Tên người dùng
  process.env.DB_PASSWORD as string, // Mật khẩu
  {
    host: process.env.DB_HOST as string, // Địa chỉ host (ví dụ: localhost)
    dialect: process.env.DB_DIALECT as Dialect, // Loại CSDL (ví dụ: mysql, postgres, sqlite, mssql)
    logging: false, // Tắt log SQL query trong console (tùy chọn)
    pool: {
      max: 5, // Số lượng kết nối tối đa
      min: 0, // Số lượng kết nối tối thiểu
      acquire: 30000, // Thời gian tối đa (ms) để kết nối
      idle: 10000, // Thời gian tối đa (ms) kết nối không sử dụng sẽ bị đóng
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Nếu cần kết nối với SSL
      },
      // ssl: {
      //   require: false,
      // },
    },
  }
);

export default sequelize;
