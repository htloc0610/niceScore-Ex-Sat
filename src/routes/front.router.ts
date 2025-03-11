//this file is API router for student
import { Router } from "express";
import path from "path";

const frontRouter = Router();

frontRouter.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));}
);

export default frontRouter;
