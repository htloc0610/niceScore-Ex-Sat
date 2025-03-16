import express from "express";
import "dotenv/config";
import setupRoutes from "./routes/index.router";
import path from "path";
import cors from "cors";
import sequelize from "./config/db";
import Student from "./models/student.model";
import Faculty from "./models/faculty.model";
import setupRelation from "./models/realation";

const app = express();
const port: string | number = process.env.PORT || 8080;

// Middleware để xử lý JSON
app.use(express.json());

app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "../public")));

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

    setupRelation();
    console.log("Database connection established");
  } catch (e) {
    console.log("Database connection failed", e);
  }
};

// Sync models
(async () => {
  await connectDB();
})();
