import { Request, Response, NextFunction } from 'express';
import { isValidLanguage, getDefaultLanguage, LANGUAGE_OPTIONS } from '../utils/languageUtils';

/**
 * Middleware to handle language settings for the application
 * This middleware determines the current language based on:
 * 1. Cookies (set by frontend localStorage)
 * 2. Query parameters (for backward compatibility)
 * 3. Default language (English)
 */
export const languageMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get default language
  let lang = getDefaultLanguage();
  
  // First, check if language is set in cookies (set by frontend localStorage)
  if (req.cookies?.lang && isValidLanguage(req.cookies.lang)) {
    lang = req.cookies.lang;
  } 
  // Then check query parameter (for backward compatibility)
  else if (req.query.lang && isValidLanguage(req.query.lang as string)) {
    lang = req.query.lang as string;
    
    // Set cookie for future requests
    res.cookie('lang', lang, { 
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: false // Allow JavaScript access
    });
  }
  
  // Add language to res.locals for use in templates
  res.locals.lang = lang;
  res.locals.languages = LANGUAGE_OPTIONS; // Make language options available to all templates
  
  // Add it to each response for the frontend
  res.locals.data = { 
    ...res.locals.data,
    lang,
    languages: LANGUAGE_OPTIONS
  };
  
  next();
};

export default languageMiddleware;
