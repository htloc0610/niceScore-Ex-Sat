import express from "express";
import "dotenv/config";
import setupRoutes from "./routes/index.router";
import sequelize from "./config/db";
import { DataTypes } from "sequelize";
import Student from "./models/student.model";
import Faculty from "./models/faculty.model";

const app = express();
const port: string | number = process.env.PORT || 8080;

// Middleware để xử lý JSON
app.use(express.json());

console.log("OK");

setupRoutes(app);

app.listen(port, (): void => {
  console.log(`Server is listening on port ${port}`);
});

const connectDB = async () => {
  console.log("Check database connection...");
  try {
    await sequelize.authenticate();
    // Đồng bộ các models
    await sequelize.sync({ force: false });
    console.log("Database connection established");
  } catch (e) {
    console.log("Database connection failed", e);
  }
};

// Sync models
(async () => {
  await connectDB();
  await Student.sync();
  await Faculty.sync();
  // Kiểm tra nếu bảng Faculty rỗng, thì thêm dữ liệu mặc định
  const faculties = [
    "Khoa Luật",
    "Khoa Tiếng Anh thương mại",
    "Khoa Tiếng Nhật",
    "Khoa Tiếng Pháp",
  ];
  for (const name of faculties) {
    await Faculty.findOrCreate({ where: { name } });
  }
})();
