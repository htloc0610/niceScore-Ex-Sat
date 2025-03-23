import { Application } from "express";
import studentRouter from "./student.router";
import frontRouter from "./front.router";
import exportRoutes from "./export.routes";
import importRoutes from "./import.router";
import facultyRouter from "./faculty.router";
import statusRouter from "./status.router";
import courseRouter from "./course.router";

const setupRoutes = (app: Application): void => {
  app.use("/api/student", studentRouter);

  app.use("/api/faculty", facultyRouter);

  app.use("/api/status", statusRouter);

  app.use("/api/course", courseRouter);

  app.use("/export", exportRoutes);

  app.use("/import", importRoutes);

  app.use("/", frontRouter);
};

export default setupRoutes;
