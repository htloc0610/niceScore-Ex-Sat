"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const status_controller_1 = __importDefault(require("../controllers/status.controller"));
const statusRouter = (0, express_1.Router)();
// [GET] /api/status
statusRouter.get("/", status_controller_1.default.getListStatus);
// [POST] /api/status
statusRouter.post("/", status_controller_1.default.addStatus);
// [PUT] /api/status
statusRouter.put("/", status_controller_1.default.updateStatus);
exports.default = statusRouter;
//# sourceMappingURL=status.router.js.map