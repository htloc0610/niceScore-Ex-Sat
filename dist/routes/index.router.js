"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_router_1 = __importDefault(require("./student.router"));
const setupRoutes = (app) => {
    app.use("/", student_router_1.default);
};
exports.default = setupRoutes;
//# sourceMappingURL=index.router.js.map