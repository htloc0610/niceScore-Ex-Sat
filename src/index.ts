import express from "express";
import "dotenv/config";
import setupRoutes from "./routes/index.router";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import sequelize from "./config/db";
import setupRelation from "./models/realation";
import hbs from "./config/handlebars";
import { languageMiddleware } from "./i18n";

const app = express();
const port: string | number = process.env.PORT || 8080;

// Middleware to handle JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Language middleware
app.use(languageMiddleware);

// Serve static files from the "public" directory with proper MIME types
app.use(
  express.static(path.join(__dirname, "../src/public"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      } else if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

// Configure Handlebars
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "../src/views"));

// Connect to the database before starting the server
const connectDB = async () => {
  console.log("Checking database connection...");
  try {
    // await sequelize.authenticate();
    setupRelation();
    // await sequelize.sync({ alter: true });
    console.log("Database connection established!");

    // Start the server only when the database is successfully connected
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Set up routes after the database is ready
    setupRoutes(app);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit the application if database connection fails
  }
};

// Execute the database connection
(async () => {
  await connectDB();
})();

export default app;
