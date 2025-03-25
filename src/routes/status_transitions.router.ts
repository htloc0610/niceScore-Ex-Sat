import { Router } from "express";
import statusTransitionController from "../controllers/status_transitions.controller";

const statusTransitionsRouter = Router();

// [GET] /api/status_transition
statusTransitionsRouter.get(
  "/",
  statusTransitionController.getStatusTransitions
);

// [POST] /api/status_transition
statusTransitionsRouter.post(
  "/",
  statusTransitionController.addStatusTransitions
);

// [PATCH] /api/status_transition
statusTransitionsRouter.put(
  "/",
  statusTransitionController.updateStatusTransitions
);

export default statusTransitionsRouter;
