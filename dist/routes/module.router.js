"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const module_controller_1 = __importDefault(require("../controllers/module.controller"));
const moduleRouter = (0, express_1.Router)();
// [GET] /api/module
moduleRouter.get("/", module_controller_1.default.getListModules);
// [POST] /api/module
moduleRouter.post("/", module_controller_1.default.addModule);
// [GET] /api/module/:id
moduleRouter.get("/:id", module_controller_1.default.getModule);
// [PUT] /api/module/:id
moduleRouter.put("/:id", module_controller_1.default.updateModule);
exports.default = moduleRouter;
//# sourceMappingURL=module.router.js.map