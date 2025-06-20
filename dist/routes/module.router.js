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
moduleRouter.get("/no-lang/:id", module_controller_1.default.getModuleByIdNoLanguage);
// [GET] /api/module/:id/translations - Get all translations
moduleRouter.get("/:id/translations", module_controller_1.default.getModuleWithTranslations);
moduleRouter.get("/:id", module_controller_1.default.getModuleWithTranslations);
// [GET] /api/module/:id/translations/:language - Get specific language translation (default en)
moduleRouter.get("/:id/translations/:language", module_controller_1.default.getModuleWithLanguage);
// [POST] /api/module/:id/translations - Add/update a translation with language in body
moduleRouter.post("/:id/translations", module_controller_1.default.addModuleTranslation);
// [POST] /api/module/:id/translations/:language - Add/update a specific language translation
moduleRouter.post("/:id/translations/:language", module_controller_1.default.addModuleLanguageTranslation);
// [DELETE] /api/module/:id/translations/:language
moduleRouter.delete("/:id/translations/:language", module_controller_1.default.deleteModuleTranslation);
// [GET] /api/module/:id
// [PUT] /api/module/:id
moduleRouter.put("/:id", module_controller_1.default.updateModule);
// [DELETE] /api/module/:id
moduleRouter.delete("/:id", module_controller_1.default.deleteModule);
exports.default = moduleRouter;
//# sourceMappingURL=module.router.js.map