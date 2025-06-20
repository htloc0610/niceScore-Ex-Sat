"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageMiddleware = languageMiddleware;
const config_1 = require("./config");
/**
 * Middleware to handle language settings for the application
 * Priority: query parameters > cookies > default
 */
function languageMiddleware(req, res, next) {
    var _a;
    // Get language from cookie or query parameter
    const cookieLang = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.lang;
    const queryLang = req.query.lang;
    // Resolve the language to use
    // Changed to prioritize query parameters over cookies
    const lang = queryLang && (0, config_1.isSupportedLanguage)(queryLang)
        ? queryLang
        : (cookieLang && (0, config_1.isSupportedLanguage)(cookieLang) ? cookieLang : config_1.DEFAULT_LANGUAGE);
    // If language comes from query parameter, update cookie for future requests
    if (queryLang && lang !== config_1.DEFAULT_LANGUAGE) {
        res.cookie('lang', lang, {
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
            httpOnly: false // Allow JavaScript access
        });
    }
    // Add language to res.locals for templates
    res.locals.lang = lang;
    res.locals.languages = config_1.LANGUAGE_OPTIONS; // Make language options available to all templates
    // Add it to response data for frontend
    res.locals.data = Object.assign(Object.assign({}, res.locals.data), { lang, languages: config_1.LANGUAGE_OPTIONS });
    next();
}
exports.default = languageMiddleware;
//# sourceMappingURL=middleware.js.map