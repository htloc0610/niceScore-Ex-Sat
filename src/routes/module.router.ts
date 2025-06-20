import { Router } from "express";
import moduleController from "../controllers/module.controller";

const moduleRouter = Router();

// [GET] /api/module
moduleRouter.get("/", moduleController.getListModules);

// [POST] /api/module
moduleRouter.post("/", moduleController.addModule);

moduleRouter.get("/no-lang/:id", moduleController.getModuleByIdNoLanguage);


// [GET] /api/module/:id/translations - Get all translations
moduleRouter.get("/:id/translations", moduleController.getModuleWithTranslations);

moduleRouter.get("/:id", moduleController.getModuleWithTranslations);

// [GET] /api/module/:id/translations/:language - Get specific language translation (default en)
moduleRouter.get("/:id/translations/:language", moduleController.getModuleWithLanguage);

// [POST] /api/module/:id/translations - Add/update a translation with language in body
moduleRouter.post("/:id/translations", moduleController.addModuleTranslation);

// [POST] /api/module/:id/translations/:language - Add/update a specific language translation
moduleRouter.post("/:id/translations/:language", moduleController.addModuleLanguageTranslation);

// [DELETE] /api/module/:id/translations/:language
moduleRouter.delete("/:id/translations/:language", moduleController.deleteModuleTranslation);

// [GET] /api/module/:id

// [PUT] /api/module/:id
moduleRouter.put("/:id", moduleController.updateModule);

// [DELETE] /api/module/:id
moduleRouter.delete("/:id", moduleController.deleteModule);

export default moduleRouter;
