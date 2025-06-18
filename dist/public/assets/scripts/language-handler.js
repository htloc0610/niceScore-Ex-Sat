/**
 * Client-side language handler
 * This script centralizes all language-related functionality for the browser:
 * - Manages language settings in localStorage and cookies
 * - Updates the UI when language changes
 * - Sets the HTML lang attribute for accessibility
 * - Provides methods for translating text
 * 
 * Usage:
 * 1. Include this script in your HTML: <script src="/assets/scripts/language-handler.js"></script>
 * 2. Use the t() function to translate: t('index.header.title')
 * 3. Or use LanguageHandler methods: LanguageHandler.translate('index.header.title')
 */

window.LanguageHandler = {
  // Constants - keep in sync with server-side config
  SUPPORTED_LANGUAGES: ['en', 'vi'],
  DEFAULT_LANGUAGE: 'en',
  
  // Current translations cache
  translations: null,
  currentLanguage: null,
  
  /**
   * Check if a language is supported
   * @param {string} lang - Language code to check
   * @returns {boolean} True if supported
   */
  isValidLanguage(lang) {
    return this.SUPPORTED_LANGUAGES.includes(lang);
  },
    /**
   * Get the current language from localStorage or server
   * @returns {string} Language code
   */
  getCurrentLanguage() {
    // Try localStorage first (client preference)
    const localLang = localStorage.getItem("lang");
    
    // Then try data attribute in html (server-side setting)
    const serverLang = document.documentElement.getAttribute('data-lang');
    
    // Log state for debugging
    console.log(`Language sources - localStorage: ${localLang}, server: ${serverLang}`);
    
    // Use the first valid language found or default
    if (localLang && this.isValidLanguage(localLang)) {
      return localLang;
    } else if (serverLang && this.isValidLanguage(serverLang)) {
      return serverLang;
    }
    return this.DEFAULT_LANGUAGE;
  },
  
  /**
   * Set a new language
   * @param {string} lang - Language code
   * @returns {boolean} Success status
   */  setLanguage(lang) {
    if (!this.isValidLanguage(lang)) {
      console.warn(`Unsupported language: ${lang}`);
      return false;
    }
    
    this.currentLanguage = lang;
    
    // Update localStorage
    localStorage.setItem("lang", lang);
    
    // Update cookie
    this.updateCookie(lang);
    
    // Update UI
    this.updateUI(lang);
    
    // Dispatch a custom event for other components to react to language changes
    const event = new CustomEvent('languageChanged', { detail: { language: lang } });
    window.dispatchEvent(event);
    console.log('Dispatched languageChanged event:', lang);
    
    return true;
  },
  
  /**
   * Update the language cookie for server-side detection
   * @param {string} lang - Language code
   */
  updateCookie(lang) {
    const oneYearInSeconds = 365 * 24 * 60 * 60;
    document.cookie = `lang=${lang}; path=/; max-age=${oneYearInSeconds}`;
  },
    /**
   * Update UI elements for the selected language
   * @param {string} lang - Language code
   */
  updateUI(lang) {
    console.log(`Updating UI for language: ${lang}`);
    
    // Update language selector
    const langSelector = document.getElementById("languageSelect");
    if (langSelector) {
      console.log(`Found language selector, setting to: ${lang}`);
      langSelector.value = lang;
    } else {
      console.warn("Language selector not found in DOM");
    }
    
    // Update HTML lang attribute for accessibility
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
  },
  
  /**
   * Handle language change from selector
   * @param {Event} event - Change event
   */  /**
   * Handle language change from selector
   * Ensures translations are loaded before page reload
   * @param {Event} event - Change event
   */
  async handleLanguageChange(event) {
    const newLang = event.target.value;
    
    if (LanguageHandler.setLanguage(newLang)) {
      // Load translations for the new language before reloading
      try {
        await LanguageHandler.loadTranslations();
        console.log(`Loaded translations for ${newLang} before page reload`);
        
        // Small delay to allow other scripts to respond to the language change
        setTimeout(() => {
          // Reload page to apply changes
          window.location.reload();
        }, 100);
      } catch (error) {
        console.error('Error loading translations before page reload:', error);
        // Reload anyway as a fallback
        window.location.reload();
      }
    }
  },
  
  /**
   * Load translations for the current language
   * @returns {Promise<Object>} Translation object
   */
  async loadTranslations() {
    const lang = this.currentLanguage || this.getCurrentLanguage();
    const translationUrl = `/assets/scripts/locales/${lang}.json`;
    
    try {
      const res = await fetch(translationUrl);
      if (!res.ok) throw new Error(`Failed to load translations for ${lang}`);
      this.translations = await res.json();
      return this.translations;
    } catch (error) {
      console.error("Error loading translations:", error);
      return {};
    }
  },
  
  /**
   * Get translation by key
   * @param {string} key - Dot notation path to translation
   * @returns {string} Translated text or key if not found
   */
  translate(key) {
    if (!this.translations) {
      console.warn('Translations not loaded yet');
      return key;
    }
    
    // Navigate the nested object using the key path
    return key.split('.').reduce((o, i) => (o && o[i] !== undefined ? o[i] : key), this.translations);
  },
    /**
   * Initialize the language handler
   * @returns {Promise<string>} The active language
   */
  async init() {
    console.log("Initializing language handler...");
    
    // Get and set current language
    this.currentLanguage = this.getCurrentLanguage();
    console.log(`Current language detected: ${this.currentLanguage}`);
    
    // Apply the language
    this.setLanguage(this.currentLanguage);
    
    // Add event listener to language selector
    const langSelector = document.getElementById("languageSelect");
    if (langSelector) {
      console.log("Adding event listener to language selector");
      // Remove any existing listeners first to avoid duplicates
      langSelector.removeEventListener('change', this.handleLanguageChange);
      // Add new listener
      langSelector.addEventListener('change', this.handleLanguageChange);
    } else {
      console.warn("Language selector not found during initialization");
    }
    
    // Load translations
    await this.loadTranslations();
    
    console.log(`Language handler initialized with: ${this.currentLanguage}`);
    return this.currentLanguage;
  }
};

// Initialize when the document is loaded
document.addEventListener("DOMContentLoaded", async () => {
  console.log('LanguageHandler initializing...');
  await LanguageHandler.init();
  console.log('LanguageHandler initialized with language:', LanguageHandler.currentLanguage);
  
  // Force update UI when initialized
  LanguageHandler.updateUI(LanguageHandler.currentLanguage);
});

// Shorthand for translate function - always use the most up-to-date translations
window.t = (key) => {
  // If translations aren't loaded or we're mid-language change, ensure we have them
  if (!LanguageHandler.translations) {
    console.warn(`Translations not loaded yet when trying to translate: ${key}`);
    // Return the key as fallback in case translations aren't ready
    return key;
  }
  return LanguageHandler.translate(key);
};
