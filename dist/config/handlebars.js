"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_handlebars_1 = require("express-handlebars");
const path_1 = __importDefault(require("path"));
const hbs = (0, express_handlebars_1.create)({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path_1.default.join(__dirname, "../views/layouts"),
    partialsDir: path_1.default.join(__dirname, "../views/partials"),
});
exports.default = hbs;
//# sourceMappingURL=handlebars.js.map