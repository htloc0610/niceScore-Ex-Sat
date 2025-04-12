import { Application } from "express";
import studentRouter from "./student.router";
import frontRouter from "./front.router";
import exportRoutes from "./export.routes";
import importRoutes from "./import.router";
import facultyRouter from "./faculty.router";
import statusRouter from "./status.router";
import courseRouter from "./course.router";
import statusTransitionsRouter from "./status_transitions.router";
import configurationsRouter from "./configurations.router";
import moduleRouter from "./module.router";
import classRouter from "./class.router";
import transcriptRouter from "./transcript.router";
import classRegistationRouter from "./class_registation.router";

const setupRoutes = (app: Application): void => {
  app.use("/api/student", studentRouter);

  app.use("/api/faculty", facultyRouter);

  app.use("/api/status", statusRouter);

  app.use("/api/course", courseRouter);

  app.use("/api/module", moduleRouter);

  app.use("/api/class", classRouter);

  app.use("/api/transcript", transcriptRouter);

  app.use("/api/class_registation", classRegistationRouter);

  app.use("/api/status_transition", statusTransitionsRouter);

  app.use("/api/configurations", configurationsRouter);

  app.use("/export", exportRoutes);

  app.use("/import", importRoutes);

  app.use("/", frontRouter);
};

export default setupRoutes;
