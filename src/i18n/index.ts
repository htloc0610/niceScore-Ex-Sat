/**
 * Internationalization (i18n) module for the application
 * This is the main entry point for all i18n-related functionality
 * 
 * Import from this module to access all i18n features:
 * import { t, LANGUAGES, languageMiddleware } from './i18n';
 */

// Export everything from our centralized modules
export * from './config';
export * from './helpers';
export { default as languageMiddleware } from './middleware';

// Export utility functions directly from this module for convenience
export { 
  getLanguageFromOptions,
  getStatusClass,
  languageHelpers
} from './helpers';

// Import individual functions from languageUtils for backward compatibility
// These will be removed once all code is migrated to use the new structure
import { 
  isValidLanguage as _isValid,
  getDefaultLanguage as _getDefault,
  getActiveStatusText as _getActiveStatus,
  getPrerequisiteText as _getPrereq
} from '../utils/languageUtils';

// Re-export with deprecated notice
/** @deprecated Use functions from i18n module instead */
export const getActiveStatusTextLegacy = _getActiveStatus;
/** @deprecated Use functions from i18n module instead */
export const getPrerequisiteTextLegacy = _getPrereq;
/** @deprecated Use functions from i18n module instead */
export const isValidLanguageLegacy = _isValid;
/** @deprecated Use functions from i18n module instead */
export const getDefaultLanguageLegacy = _getDefault;
