"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_router_1 = __importDefault(require("./student.router"));
const front_router_1 = __importDefault(require("./front.router"));
const export_routes_1 = __importDefault(require("./export.routes"));
const setupRoutes = (app) => {
    app.use("/api", student_router_1.default);
    app.use("/export", export_routes_1.default);
    app.use("/", front_router_1.default);
};
exports.default = setupRoutes;
//# sourceMappingURL=index.router.js.map