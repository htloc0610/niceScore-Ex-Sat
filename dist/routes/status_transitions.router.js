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
// [GET] /api/status_transition/:id
statusTransitionsRouter.get("/:id", status_transitions_controller_1.default.getValidNextStatusById);
// [POST] /api/status_transition
statusTransitionsRouter.post("/", status_transitions_controller_1.default.addStatusTransitions);
// [PUT] /api/status_transition
statusTransitionsRouter.put("/", status_transitions_controller_1.default.updateStatusTransitions);
// [DELETE] /api/status_transition
statusTransitionsRouter.delete("/:id", status_transitions_controller_1.default.deleteStatusTransitions);
exports.default = statusTransitionsRouter;
//# sourceMappingURL=status_transitions.router.js.map