//this file is API router for student
import { Router } from "express";
import path from "path";

const frontRouter = Router();

frontRouter.get("/more", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/more.html"));}
);
frontRouter.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));}
);

frontRouter.get("/detail", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public/detail.html"));}
);

export default frontRouter;
