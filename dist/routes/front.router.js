"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//this file is API router for student
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const frontRouter = (0, express_1.Router)();
frontRouter.get("/more", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../public/more.html"));
});
frontRouter.get("/add", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../public/add.html"));
});
frontRouter.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/index.html"));
});
exports.default = frontRouter;
//# sourceMappingURL=front.router.js.map