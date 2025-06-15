"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREREQUISITE_TEXT = exports.ACTIVE_STATUS_TEXT = exports.STATUS_CLASSES = exports.STATUS_NAMES = exports.LANGUAGE_OPTIONS = exports.DEFAULT_LANGUAGE = exports.SUPPORTED_LANGUAGES = exports.LANGUAGES = void 0;
exports.loadTranslations = loadTranslations;
exports.getTranslation = getTranslation;
exports.isSupportedLanguage = isSupportedLanguage;
exports.resolveLanguage = resolveLanguage;
/**
 * i18n Configuration
 * This file contains core configuration for the application's internationalization features.
 */
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Define supported languages
exports.LANGUAGES = {
    EN: 'en',
    VI: 'vi'
};
exports.SUPPORTED_LANGUAGES = Object.values(exports.LANGUAGES);
// Default language
exports.DEFAULT_LANGUAGE = exports.LANGUAGES.EN;
// Available language options for UI
exports.LANGUAGE_OPTIONS = [
    { value: exports.LANGUAGES.EN, label: 'English' },
    { value: exports.LANGUAGES.VI, label: 'Tiếng Việt' }
];
// Status name mappings for both languages
exports.STATUS_NAMES = {
    [exports.LANGUAGES.EN]: {
        is_learning: 'Studying',
        graduated: 'Graduated',
        dropped_out: 'Dropped Out',
        paused: 'Paused'
    },
    [exports.LANGUAGES.VI]: {
        is_learning: 'Đang học',
        graduated: 'Đã tốt nghiệp',
        dropped_out: 'Đã thôi học',
        paused: 'Tạm dừng học'
    }
};
// Status class mappings for styling
exports.STATUS_CLASSES = {
    is_learning: "px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600",
    graduated: "px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100",
    dropped_out: "px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700",
    paused: "px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:text-yellow-100 dark:bg-yellow-700",
    default: "px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700"
};
// Active/inactive text mapping for both languages
exports.ACTIVE_STATUS_TEXT = {
    [exports.LANGUAGES.EN]: {
        active: 'Active',
        inactive: 'Inactive'
    },
    [exports.LANGUAGES.VI]: {
        active: 'Hoạt động',
        inactive: 'Dừng'
    }
};
// Prerequisite text mapping
exports.PREREQUISITE_TEXT = {
    [exports.LANGUAGES.EN]: 'None',
    [exports.LANGUAGES.VI]: 'Không'
};
/**
 * Load translations from JSON files
 */
function loadTranslations() {
    const translations = {
        [exports.LANGUAGES.EN]: JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../public/assets/scripts/locales/en.json'), 'utf-8')),
        [exports.LANGUAGES.VI]: JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../public/assets/scripts/locales/vi.json'), 'utf-8'))
    };
    return translations;
}
/**
 * Get a translated value by key
 * @param language The language to use
 * @param key The dot-notation key for the translation
 * @param translations The translations object
 */
function getTranslation(language, key, translations) {
    return key.split('.').reduce((res, k) => (res ? res[k] : undefined), translations[language]);
}
/**
 * Check if a language is supported
 * @param language The language code to check
 */
function isSupportedLanguage(language) {
    return exports.SUPPORTED_LANGUAGES.includes(language);
}
/**
 * Resolve language from available sources with priority:
 * 1. Cookie language
 * 2. Query parameter language
 * 3. Default language
 *
 * @param cookieLang Language from cookies
 * @param queryLang Language from query parameter
 */
function resolveLanguage(cookieLang, queryLang) {
    if (cookieLang && isSupportedLanguage(cookieLang))
        return cookieLang;
    if (queryLang && isSupportedLanguage(queryLang))
        return queryLang;
    return exports.DEFAULT_LANGUAGE;
}
//# sourceMappingURL=config.js.map