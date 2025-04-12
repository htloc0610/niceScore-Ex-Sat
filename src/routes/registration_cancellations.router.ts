import { Router } from "express";
import classCancellationController from "../controllers/class_cancellation.controller";

const classCancellationRouter = Router();

// [GET] /api/class_cancellation
classCancellationRouter.get(
  "/",
  classCancellationController.getClassCancellationList
);

export default classCancellationRouter;
