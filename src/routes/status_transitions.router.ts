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

// [PUT] /api/status_transition
statusTransitionsRouter.put(
  "/",
  statusTransitionController.updateStatusTransitions
);

// [DELETE] /api/status_transition
statusTransitionsRouter.delete(
  "/:id",
  statusTransitionController.deleteStatusTransitions
);

export default statusTransitionsRouter;
