"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_handlebars_1 = require("express-handlebars");
const path_1 = __importDefault(require("path"));
const helpers_1 = require("../i18n/helpers");
const hbs = (0, express_handlebars_1.create)({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path_1.default.join(__dirname, "../views/layouts"),
    partialsDir: path_1.default.join(__dirname, "../views/partials"), helpers: Object.assign(Object.assign({}, helpers_1.languageHelpers), { 
        // Additional helpers not related to i18n
        eq: (a, b) => a === b, ifEqual: (a, b, options) => {
            if (a == b) {
                return options.fn(this); // Render block if true
            }
            return options.inverse(this); // Render block if false
        }, 
        // JSON helper to stringify objects for client-side use
        json: (context) => {
            return JSON.stringify(context);
        } })
});
exports.default = hbs;
//# sourceMappingURL=handlebars.js.map