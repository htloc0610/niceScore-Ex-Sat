import { Application } from "express";
import studentRouter from "./student.router";

const setupRoutes = (app: Application): void => {
  app.use("/", studentRouter);
};

export default setupRoutes;
