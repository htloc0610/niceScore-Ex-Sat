import { Router } from "express";
import statusController from "../controllers/student.controller";

const statusRouter = Router();

statusRouter.get("/status", statusController.getListStatus);

statusRouter.post("/add_status", statusController.addStatus);

statusRouter.put("/update_status", statusController.updateStatus);

export default statusRouter;
