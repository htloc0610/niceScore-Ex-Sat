"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//this file is API router for student
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
// [GET] /more
router.get("/more", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../public/more.html"));
});
// [GET] /add
router.get("/add", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../public/add.html"));
});
// [GET] /
router.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../public/index.html"));
});
// [GET] /:id
router.get("/:id", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../public/detail.html"));
});
exports.default = router;
//# sourceMappingURL=front.router.js.map