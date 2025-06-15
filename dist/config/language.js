"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageMiddleware = void 0;
const languageUtils_1 = require("../utils/languageUtils");
/**
 * Middleware to handle language settings for the application
 * This middleware determines the current language based on:
 * 1. Cookies (set by frontend localStorage)
 * 2. Query parameters (for backward compatibility)
 * 3. Default language (English)
 */
const languageMiddleware = (req, res, next) => {
    var _a;
    // Get default language
    let lang = (0, languageUtils_1.getDefaultLanguage)();
    // First, check if language is set in cookies (set by frontend localStorage)
    if (((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.lang) && (0, languageUtils_1.isValidLanguage)(req.cookies.lang)) {
        lang = req.cookies.lang;
    }
    // Then check query parameter (for backward compatibility)
    else if (req.query.lang && (0, languageUtils_1.isValidLanguage)(req.query.lang)) {
        lang = req.query.lang;
        // Set cookie for future requests
        res.cookie('lang', lang, {
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
            httpOnly: false // Allow JavaScript access
        });
    }
    // Add language to res.locals for use in templates
    res.locals.lang = lang;
    res.locals.languages = languageUtils_1.LANGUAGE_OPTIONS; // Make language options available to all templates
    // Add it to each response for the frontend
    res.locals.data = Object.assign(Object.assign({}, res.locals.data), { lang, languages: languageUtils_1.LANGUAGE_OPTIONS });
    next();
};
exports.languageMiddleware = languageMiddleware;
exports.default = exports.languageMiddleware;
//# sourceMappingURL=language.js.map