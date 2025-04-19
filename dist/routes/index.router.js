"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const student_router_1 = __importDefault(require("./student.router"));
const front_router_1 = __importDefault(require("./front.router"));
const export_routes_1 = __importDefault(require("./export.routes"));
const import_router_1 = __importDefault(require("./import.router"));
const faculty_router_1 = __importDefault(require("./faculty.router"));
const status_router_1 = __importDefault(require("./status.router"));
const course_router_1 = __importDefault(require("./course.router"));
const status_transitions_router_1 = __importDefault(require("./status_transitions.router"));
const configurations_router_1 = __importDefault(require("./configurations.router"));
const module_router_1 = __importDefault(require("./module.router"));
const class_router_1 = __importDefault(require("./class.router"));
const transcript_router_1 = __importDefault(require("./transcript.router"));
const class_registation_router_1 = __importDefault(require("./class_registation.router"));
const registration_cancellations_router_1 = __importDefault(require("./registration_cancellations.router"));
const setupRoutes = (app) => {
    app.use("/api/student", student_router_1.default);
    app.use("/api/faculty", faculty_router_1.default);
    app.use("/api/status", status_router_1.default);
    app.use("/api/course", course_router_1.default);
    app.use("/api/module", module_router_1.default);
    app.use("/api/class", class_router_1.default);
    app.use("/api/transcript", transcript_router_1.default);
    app.use("/api/class_registation", class_registation_router_1.default);
    app.use("/api/class_cancellation", registration_cancellations_router_1.default);
    app.use("/api/status_transition", status_transitions_router_1.default);
    app.use("/api/configurations", configurations_router_1.default);
    app.use("/export", export_routes_1.default);
    app.use("/import", import_router_1.default);
    app.use("/", front_router_1.default);
};
exports.default = setupRoutes;
//# sourceMappingURL=index.router.js.map