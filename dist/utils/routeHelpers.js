"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderWithLanguage = renderWithLanguage;
/**
 * Helper to add language information to view rendering
 *
 * @param req Express Request object
 * @param res Express Response object
 * @param viewName Name of the view to render
 * @param viewData Data to pass to the view
 */
function renderWithLanguage(req, res, viewName, viewData = {}) {
    // Get language from res.locals (set by middleware)
    const lang = res.locals.lang || 'en';
    // Add language to view data
    const dataWithLanguage = Object.assign(Object.assign({}, viewData), { lang });
    // Render the view with language
    res.render(viewName, dataWithLanguage);
}
//# sourceMappingURL=routeHelpers.js.map