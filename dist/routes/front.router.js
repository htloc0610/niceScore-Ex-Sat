"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const configurations_service_1 = __importDefault(require("../services/configurations.service"));
const router = (0, express_1.Router)();
// [GET] /more
router.get("/more", (req, res) => {
    res.render("more"); // Render the "more" Handlebars template
});
// [GET] /add
router.get("/add", (req, res) => {
    res.render("add"); // Render the "add" Handlebars template
});
// [GET] /
router.get("/configurations", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const configurations = yield configurations_service_1.default.getAllConfiguration(); // Get the configurations from the service
    res.render("configurations", { configurations: configurations }); // Render the "configurations" Handlebars template
}));
// [GET] /
router.get("/", (req, res) => {
    res.render("index"); // Render the "index" Handlebars template
});
// [GET] /:id
router.get("/:id", (req, res) => {
    res.render("detail", { id: req.params.id }); // Render the "detail" Handlebars template with the id parameter
});
exports.default = router;
//# sourceMappingURL=front.router.js.map