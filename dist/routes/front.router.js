"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//this file is API router for student
const express_1 = require("express");
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
router.get("/", (req, res) => {
    res.render("index"); // Render the "index" Handlebars template
});
// [GET] /:id
router.get("/:id", (req, res) => {
    res.render("detail", { id: req.params.id }); // Render the "detail" Handlebars template with the id parameter
});
exports.default = router;
//# sourceMappingURL=front.router.js.map