import { Application } from "express";
import studentRouter from "./student.router";
import frontRouter from "./front.router";

const setupRoutes = (app: Application): void => {
  app.use("/api", studentRouter);
  app.use("/", frontRouter);
};

export default setupRoutes;
