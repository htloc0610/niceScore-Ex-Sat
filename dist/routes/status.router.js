"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const student_controller_1 = __importDefault(require("../controllers/student.controller"));
const statusRouter = (0, express_1.Router)();
statusRouter.get("/status", student_controller_1.default.getListStatus);
statusRouter.post("/add_status", student_controller_1.default.addStatus);
statusRouter.put("/update_status", student_controller_1.default.updateStatus);
exports.default = statusRouter;
//# sourceMappingURL=status.router.js.map