/**
 * i18n Handlebars helpers
 * This module contains all Handlebars helpers needed for internationalization
 */
import fs from 'fs';
import path from 'path';
import { 
  SupportedLanguage, 
  DEFAULT_LANGUAGE, 
  LANGUAGES, 
  isSupportedLanguage, 
  STATUS_CLASSES,
  STATUS_NAMES,
  ACTIVE_STATUS_TEXT,
  PREREQUISITE_TEXT
} from './config';

// Load translation files
const translations = {
  [LANGUAGES.EN]: JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/scripts/locales/en.json'), 'utf-8')),
  [LANGUAGES.VI]: JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/scripts/locales/vi.json'), 'utf-8'))
};

/**
 * Helper function to safely retrieve nested values from objects
 */
function getNested(obj: any, key: string): any {
  return key.split('.').reduce((res, k) => (res ? res[k] : undefined), obj);
}

/**
 * Get language from Handlebars options
 */
export function getLanguageFromOptions(options: any): SupportedLanguage {
  if (options?.data?.root?.lang && isSupportedLanguage(options.data.root.lang)) {
    return options.data.root.lang;
  }
  return DEFAULT_LANGUAGE;
}

/**
 * Get the CSS class for a status
 */
export function getStatusClass(statusName: string): string {
  // Check English status names
  if (statusName === STATUS_NAMES[LANGUAGES.EN].is_learning || 
      statusName === STATUS_NAMES[LANGUAGES.VI].is_learning) {
    return STATUS_CLASSES.is_learning;
  }
  
  if (statusName === STATUS_NAMES[LANGUAGES.EN].graduated || 
      statusName === STATUS_NAMES[LANGUAGES.VI].graduated) {
    return STATUS_CLASSES.graduated;
  }
  
  if (statusName === STATUS_NAMES[LANGUAGES.EN].dropped_out || 
      statusName === STATUS_NAMES[LANGUAGES.VI].dropped_out) {
    return STATUS_CLASSES.dropped_out;
  }
  
  if (statusName === STATUS_NAMES[LANGUAGES.EN].paused || 
      statusName === STATUS_NAMES[LANGUAGES.VI].paused) {
    return STATUS_CLASSES.paused;
  }
  
  return STATUS_CLASSES.default;
}

/**
 * Handlebars helpers for i18n and UI formatting
 */
export const languageHelpers = {
  /**
   * Translate text using key
   */
  t: function (key: string, options: any) {
    const lang = getLanguageFromOptions(options);
    return getNested(translations[lang], key);
  },

  /**
   * Get active/inactive text based on language
   */
  isActiveText: (isActive: boolean, options: any) => {
    const lang = getLanguageFromOptions(options);
    return isActive 
      ? ACTIVE_STATUS_TEXT[lang].active 
      : ACTIVE_STATUS_TEXT[lang].inactive;
  },

  /**
   * Get CSS class for active/inactive status
   */
  isActiveClass: (isActive: boolean) => {
    if (isActive) 
      return STATUS_CLASSES.is_learning;
    else 
      return STATUS_CLASSES.dropped_out;
  },

  /**
   * Display prerequisite based on language
   */
  prerequisiteDisplay: (prerequisite: any, options: any) => {
    const lang = getLanguageFromOptions(options);
    return prerequisite ? prerequisite.module_code : PREREQUISITE_TEXT[lang];
  },

  /**
   * Get CSS class for status
   */
  statusClass: getStatusClass,
  
  /**
   * Format JSON for client-side use
   */
  json: (context: any) => JSON.stringify(context)
};
