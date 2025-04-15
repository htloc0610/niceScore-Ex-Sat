"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const class_cancellation_controller_1 = __importDefault(require("../controllers/class_cancellation.controller"));
const classCancellationRouter = (0, express_1.Router)();
// [GET] /api/class_cancellation
classCancellationRouter.get("/", class_cancellation_controller_1.default.getClassCancellationList);
// [GET] /api/class_cancellation/{moduleID}
classCancellationRouter.get("/:moduleID", class_cancellation_controller_1.default.getClassCancellationDetails);
exports.default = classCancellationRouter;
//# sourceMappingURL=registration_cancellations.router.js.map