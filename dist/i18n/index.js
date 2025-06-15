"use strict";
/**
 * Internationalization (i18n) module for the application
 * This is the main entry point for all i18n-related functionality
 *
 * Import from this module to access all i18n features:
 * import { t, LANGUAGES, languageMiddleware } from './i18n';
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultLanguageLegacy = exports.isValidLanguageLegacy = exports.getPrerequisiteTextLegacy = exports.getActiveStatusTextLegacy = exports.languageHelpers = exports.getStatusClass = exports.getLanguageFromOptions = exports.languageMiddleware = void 0;
// Export everything from our centralized modules
__exportStar(require("./config"), exports);
__exportStar(require("./helpers"), exports);
var middleware_1 = require("./middleware");
Object.defineProperty(exports, "languageMiddleware", { enumerable: true, get: function () { return __importDefault(middleware_1).default; } });
// Export utility functions directly from this module for convenience
var helpers_1 = require("./helpers");
Object.defineProperty(exports, "getLanguageFromOptions", { enumerable: true, get: function () { return helpers_1.getLanguageFromOptions; } });
Object.defineProperty(exports, "getStatusClass", { enumerable: true, get: function () { return helpers_1.getStatusClass; } });
Object.defineProperty(exports, "languageHelpers", { enumerable: true, get: function () { return helpers_1.languageHelpers; } });
// Import individual functions from languageUtils for backward compatibility
// These will be removed once all code is migrated to use the new structure
const languageUtils_1 = require("../utils/languageUtils");
// Re-export with deprecated notice
/** @deprecated Use functions from i18n module instead */
exports.getActiveStatusTextLegacy = languageUtils_1.getActiveStatusText;
/** @deprecated Use functions from i18n module instead */
exports.getPrerequisiteTextLegacy = languageUtils_1.getPrerequisiteText;
/** @deprecated Use functions from i18n module instead */
exports.isValidLanguageLegacy = languageUtils_1.isValidLanguage;
/** @deprecated Use functions from i18n module instead */
exports.getDefaultLanguageLegacy = languageUtils_1.getDefaultLanguage;
//# sourceMappingURL=index.js.map