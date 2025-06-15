/**
 * i18n Configuration
 * This file contains core configuration for the application's internationalization features.
 */
import fs from 'fs';
import path from 'path';

// Define supported languages
export const LANGUAGES = {
  EN: 'en',
  VI: 'vi'
} as const;

// Type definition for supported languages
export type SupportedLanguage = typeof LANGUAGES[keyof typeof LANGUAGES]; // 'en' | 'vi'
export const SUPPORTED_LANGUAGES: SupportedLanguage[] = Object.values(LANGUAGES);

// Default language
export const DEFAULT_LANGUAGE: SupportedLanguage = LANGUAGES.EN;

// Language option interface
export interface LanguageOption {
  value: SupportedLanguage;
  label: string;
}

// Available language options for UI
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: LANGUAGES.EN, label: 'English' },
  { value: LANGUAGES.VI, label: 'Tiếng Việt' }
];

// Status name mappings for both languages
export const STATUS_NAMES = {
  [LANGUAGES.EN]: {
    is_learning: 'Studying',
    graduated: 'Graduated',
    dropped_out: 'Dropped Out',
    paused: 'Paused'
  },
  [LANGUAGES.VI]: {
    is_learning: 'Đang học',
    graduated: 'Đã tốt nghiệp',
    dropped_out: 'Đã thôi học',
    paused: 'Tạm dừng học'
  }
};

// Status class mappings for styling
export const STATUS_CLASSES = {
  is_learning: "px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:text-white dark:bg-orange-600",
  graduated: "px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100",
  dropped_out: "px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full dark:text-red-100 dark:bg-red-700",
  paused: "px-2 py-1 font-semibold leading-tight text-yellow-700 bg-yellow-100 rounded-full dark:text-yellow-100 dark:bg-yellow-700",
  default: "px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full dark:text-gray-100 dark:bg-gray-700"
};

// Active/inactive text mapping for both languages
export const ACTIVE_STATUS_TEXT = {
  [LANGUAGES.EN]: {
    active: 'Active',
    inactive: 'Inactive'
  },
  [LANGUAGES.VI]: {
    active: 'Hoạt động',
    inactive: 'Dừng'
  }
};

// Prerequisite text mapping
export const PREREQUISITE_TEXT = {
  [LANGUAGES.EN]: 'None',
  [LANGUAGES.VI]: 'Không'
};

/**
 * Load translations from JSON files
 */
export function loadTranslations() {
  const translations: Record<SupportedLanguage, any> = {
    [LANGUAGES.EN]: JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/scripts/locales/en.json'), 'utf-8')),
    [LANGUAGES.VI]: JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/scripts/locales/vi.json'), 'utf-8'))
  };
  return translations;
}

/**
 * Get a translated value by key
 * @param language The language to use
 * @param key The dot-notation key for the translation
 * @param translations The translations object
 */
export function getTranslation(language: SupportedLanguage, key: string, translations: Record<SupportedLanguage, any>): any {
  return key.split('.').reduce((res, k) => (res ? res[k] : undefined), translations[language]);
}

/**
 * Check if a language is supported
 * @param language The language code to check
 */
export function isSupportedLanguage(language: string): language is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage);
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
export function resolveLanguage(cookieLang?: string, queryLang?: string): SupportedLanguage {
  if (cookieLang && isSupportedLanguage(cookieLang)) return cookieLang;
  if (queryLang && isSupportedLanguage(queryLang)) return queryLang;
  return DEFAULT_LANGUAGE;
}
