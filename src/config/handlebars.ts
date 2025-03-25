import { create } from "express-handlebars";
import path from "path";

const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "../views/layouts"),
  partialsDir: path.join(__dirname, "../views/partials"),
});

export default hbs;