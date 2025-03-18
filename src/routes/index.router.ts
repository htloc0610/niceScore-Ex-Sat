import { Application } from "express";
import studentRouter from "./student.router";
import frontRouter from "./front.router";
import exportRoutes from "./export.routes";

const setupRoutes = (app: Application): void => {
  app.use("/api", studentRouter);
  app.use("/export", exportRoutes);
  app.use("/", frontRouter);
};

export default setupRoutes;
