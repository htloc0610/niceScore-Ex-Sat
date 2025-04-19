import winston from "winston";
import fs from "fs";
import path from "path";

// Xác định thư mục log
const logDir = process.env.VERCEL === "true" ? "/tmp" : "src/logs";

// Tạo thư mục nếu chưa tồn tại (chỉ khi không chạy trên Vercel)
if (!process.env.VERCEL && !fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
    }),
  ],
});

const dbLogger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "database.log"),
    }),
  ],
});

export { logger, dbLogger };
