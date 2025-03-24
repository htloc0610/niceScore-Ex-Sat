"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const status_transitions_controller_1 = __importDefault(require("../controllers/status_transitions.controller"));
const statusTransitionsRouter = (0, express_1.Router)();
// [GET] /api/status_transition
statusTransitionsRouter.get("/", status_transitions_controller_1.default.getStatusTransitions);
// [POST] /api/status_transition
statusTransitionsRouter.post("/", status_transitions_controller_1.default.addStatusTransitions);
// [PATCH] /api/status_transition
statusTransitionsRouter.put("/", status_transitions_controller_1.default.updateStatusTransitions);
exports.default = statusTransitionsRouter;
//# sourceMappingURL=status_transitions.router.js.map