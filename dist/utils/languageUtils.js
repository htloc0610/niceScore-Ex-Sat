"use strict";
/**
 * Language utility functions for the application
 * This module centralizes language-related logic for both server and client
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrerequisiteText = exports.getActiveStatusText = exports.getStatusClass = exports.PREREQUISITE_TEXT = exports.ACTIVE_STATUS_TEXT = exports.STATUS_CLASSES = exports.STATUS_NAMES = exports.getDefaultLanguage = exports.isValidLanguage = exports.LANGUAGE_OPTIONS = exports.LANGUAGES = void 0;
// Define valid languages for the application
exports.LANGUAGES = {
    EN: 'en',
    VI: 'vi'
};
// Available language options
exports.LANGUAGE_OPTIONS = [
    { value: exports.LANGUAGES.EN, label: 'English' },
    { value: exports.LANGUAGES.VI, label: 'Tiếng Việt' }
];
/**
 * Validates if a language is supported by the application
 * @param lang The language code to validate
 * @returns True if the language is supported, false otherwise
 */
const isValidLanguage = (lang) => {
    return Object.values(exports.LANGUAGES).includes(lang);
};
exports.isValidLanguage = isValidLanguage;
/**
 * Gets the default language for the application
 * @returns The default language code
 */
const getDefaultLanguage = () => {
    return exports.LANGUAGES.EN;
};
exports.getDefaultLanguage = getDefaultLanguage;
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
 * Maps a status name to its CSS class
 * @param statusName The status name
 * @returns The CSS class for styling the status
 */
const getStatusClass = (statusName) => {
    // Map status names to their respective classes
    if (statusName === exports.STATUS_NAMES[exports.LANGUAGES.EN].is_learning ||
        statusName === exports.STATUS_NAMES[exports.LANGUAGES.VI].is_learning) {
        return exports.STATUS_CLASSES.is_learning;
    }
    if (statusName === exports.STATUS_NAMES[exports.LANGUAGES.EN].graduated ||
        statusName === exports.STATUS_NAMES[exports.LANGUAGES.VI].graduated) {
        return exports.STATUS_CLASSES.graduated;
    }
    if (statusName === exports.STATUS_NAMES[exports.LANGUAGES.EN].dropped_out ||
        statusName === exports.STATUS_NAMES[exports.LANGUAGES.VI].dropped_out) {
        return exports.STATUS_CLASSES.dropped_out;
    }
    if (statusName === exports.STATUS_NAMES[exports.LANGUAGES.EN].paused ||
        statusName === exports.STATUS_NAMES[exports.LANGUAGES.VI].paused) {
        return exports.STATUS_CLASSES.paused;
    }
    return exports.STATUS_CLASSES.default;
};
exports.getStatusClass = getStatusClass;
/**
 * Gets text for active/inactive status based on language
 * @param isActive Whether the status is active
 * @param lang The language code
 * @returns The translated text
 */
const getActiveStatusText = (isActive, lang) => {
    const validLang = (0, exports.isValidLanguage)(lang) ? lang : (0, exports.getDefaultLanguage)();
    return isActive ? exports.ACTIVE_STATUS_TEXT[validLang].active : exports.ACTIVE_STATUS_TEXT[validLang].inactive;
};
exports.getActiveStatusText = getActiveStatusText;
/**
 * Gets text for prerequisite based on language
 * @param prerequisite The prerequisite object
 * @param lang The language code
 * @returns The prerequisite code or "None"/"Không" based on language
 */
const getPrerequisiteText = (prerequisite, lang) => {
    const validLang = (0, exports.isValidLanguage)(lang) ? lang : (0, exports.getDefaultLanguage)();
    return prerequisite ? prerequisite.module_code : exports.PREREQUISITE_TEXT[validLang];
};
exports.getPrerequisiteText = getPrerequisiteText;
//# sourceMappingURL=languageUtils.js.map