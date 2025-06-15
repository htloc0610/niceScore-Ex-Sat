/**
 * Language utility functions for the application
 * This module centralizes language-related logic for both server and client
 */

// Define valid languages for the application
export const LANGUAGES = {
  EN: 'en',
  VI: 'vi'
};

// Interface for language options
export interface LanguageOption {
  value: string;
  label: string;
}

// Available language options
export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: LANGUAGES.EN, label: 'English' },
  { value: LANGUAGES.VI, label: 'Tiếng Việt' }
];

/**
 * Validates if a language is supported by the application
 * @param lang The language code to validate
 * @returns True if the language is supported, false otherwise
 */
export const isValidLanguage = (lang: string): boolean => {
  return Object.values(LANGUAGES).includes(lang);
};

/**
 * Gets the default language for the application
 * @returns The default language code
 */
export const getDefaultLanguage = (): string => {
  return LANGUAGES.EN;
};

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
 * Maps a status name to its CSS class
 * @param statusName The status name
 * @returns The CSS class for styling the status
 */
export const getStatusClass = (statusName: string): string => {
  // Map status names to their respective classes
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
};

/**
 * Gets text for active/inactive status based on language
 * @param isActive Whether the status is active
 * @param lang The language code
 * @returns The translated text
 */
export const getActiveStatusText = (isActive: boolean, lang: string): string => {
  const validLang = isValidLanguage(lang) ? lang : getDefaultLanguage();
  return isActive ? ACTIVE_STATUS_TEXT[validLang].active : ACTIVE_STATUS_TEXT[validLang].inactive;
};

/**
 * Gets text for prerequisite based on language
 * @param prerequisite The prerequisite object
 * @param lang The language code
 * @returns The prerequisite code or "None"/"Không" based on language
 */
export const getPrerequisiteText = (prerequisite: any, lang: string): string => {
  const validLang = isValidLanguage(lang) ? lang : getDefaultLanguage();
  return prerequisite ? prerequisite.module_code : PREREQUISITE_TEXT[validLang];
};
