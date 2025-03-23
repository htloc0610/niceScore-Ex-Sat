import { Router } from "express";
import statusController from "../controllers/student.controller";

const statusRouter = Router();

// [GET] /api/status
statusRouter.get("/", statusController.getListStatus);

// [POST] /api/status
statusRouter.post("/", statusController.addStatus);

// [PUT] /api/status
statusRouter.put("/", statusController.updateStatus);

export default statusRouter;
