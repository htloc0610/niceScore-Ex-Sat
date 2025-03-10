import { Sequelize } from "sequelize";
import "dotenv/config";
import { Dialect } from "sequelize";

// Cấu hình kết nối
const sequelize = new Sequelize(
  process.env.DB_NAME, // Tên cơ sở dữ liệu
  process.env.DB_USER, // Tên người dùng
  process.env.DB_PASSWORD, // Mật khẩu
  {
    // Địa chỉ host (ví dụ: localhost)
    dialect: process.env.DB_DIALECT as Dialect, // Loại CSDL (ví dụ: mysql, postgres, sqlite, mssql)
    logging: false, // Tắt log SQL query trong console (tuỳ chọn)
    pool: {
      max: 5, // Số lượng kết nối tối đa
      min: 0, // Số lượng kết nối tối thiểu
      acquire: 30000, // Thời gian tối đa (ms) để kết nối
      idle: 10000, // Thời gian tối đa (ms) kết nối không sử dụng sẽ bị đóng
    },
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false // Đặt `false` nếu chứng chỉ không được xác thực
      // }
      ssl: false,
    },
  }
);

export default sequelize;
