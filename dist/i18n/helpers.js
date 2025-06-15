"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageHelpers = void 0;
exports.getLanguageFromOptions = getLanguageFromOptions;
exports.getStatusClass = getStatusClass;
/**
 * i18n Handlebars helpers
 * This module contains all Handlebars helpers needed for internationalization
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
// Load translation files
const translations = {
    [config_1.LANGUAGES.EN]: JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../public/assets/scripts/locales/en.json'), 'utf-8')),
    [config_1.LANGUAGES.VI]: JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../public/assets/scripts/locales/vi.json'), 'utf-8'))
};
/**
 * Helper function to safely retrieve nested values from objects
 */
function getNested(obj, key) {
    return key.split('.').reduce((res, k) => (res ? res[k] : undefined), obj);
}
/**
 * Get language from Handlebars options
 */
function getLanguageFromOptions(options) {
    var _a, _b;
    if (((_b = (_a = options === null || options === void 0 ? void 0 : options.data) === null || _a === void 0 ? void 0 : _a.root) === null || _b === void 0 ? void 0 : _b.lang) && (0, config_1.isSupportedLanguage)(options.data.root.lang)) {
        return options.data.root.lang;
    }
    return config_1.DEFAULT_LANGUAGE;
}
/**
 * Get the CSS class for a status
 */
function getStatusClass(statusName) {
    // Check English status names
    if (statusName === config_1.STATUS_NAMES[config_1.LANGUAGES.EN].is_learning ||
        statusName === config_1.STATUS_NAMES[config_1.LANGUAGES.VI].is_learning) {
        return config_1.STATUS_CLASSES.is_learning;
    }
    if (statusName === config_1.STATUS_NAMES[config_1.LANGUAGES.EN].graduated ||
        statusName === config_1.STATUS_NAMES[config_1.LANGUAGES.VI].graduated) {
        return config_1.STATUS_CLASSES.graduated;
    }
    if (statusName === config_1.STATUS_NAMES[config_1.LANGUAGES.EN].dropped_out ||
        statusName === config_1.STATUS_NAMES[config_1.LANGUAGES.VI].dropped_out) {
        return config_1.STATUS_CLASSES.dropped_out;
    }
    if (statusName === config_1.STATUS_NAMES[config_1.LANGUAGES.EN].paused ||
        statusName === config_1.STATUS_NAMES[config_1.LANGUAGES.VI].paused) {
        return config_1.STATUS_CLASSES.paused;
    }
    return config_1.STATUS_CLASSES.default;
}
/**
 * Handlebars helpers for i18n and UI formatting
 */
exports.languageHelpers = {
    /**
     * Translate text using key
     */
    t: function (key, options) {
        const lang = getLanguageFromOptions(options);
        return getNested(translations[lang], key);
    },
    /**
     * Get active/inactive text based on language
     */
    isActiveText: (isActive, options) => {
        const lang = getLanguageFromOptions(options);
        return isActive
            ? config_1.ACTIVE_STATUS_TEXT[lang].active
            : config_1.ACTIVE_STATUS_TEXT[lang].inactive;
    },
    /**
     * Get CSS class for active/inactive status
     */
    isActiveClass: (isActive) => {
        if (isActive)
            return config_1.STATUS_CLASSES.is_learning;
        else
            return config_1.STATUS_CLASSES.dropped_out;
    },
    /**
     * Display prerequisite based on language
     */
    prerequisiteDisplay: (prerequisite, options) => {
        const lang = getLanguageFromOptions(options);
        return prerequisite ? prerequisite.module_code : config_1.PREREQUISITE_TEXT[lang];
    },
    /**
     * Get CSS class for status
     */
    statusClass: getStatusClass,
    /**
     * Format JSON for client-side use
     */
    json: (context) => JSON.stringify(context)
};
//# sourceMappingURL=helpers.js.map