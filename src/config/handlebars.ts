import { create } from "express-handlebars";
import path from "path";
import { languageHelpers } from '../i18n/helpers';

const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "../views/layouts"),
  partialsDir: path.join(__dirname, "../views/partials"),  helpers: {
    // Import all language helpers
    ...languageHelpers,
    
    // Additional helpers not related to i18n
    eq: (a: any, b: any) => a === b,
    ifEqual: (a: any, b: any, options: any) => {
      if (a == b) {
        return options.fn(this); // Render block if true
      }
      return options.inverse(this); // Render block if false
    },
    // JSON helper to stringify objects for client-side use
    json: (context: any) => {
      return JSON.stringify(context);
    }
  }
  
});

export default hbs;