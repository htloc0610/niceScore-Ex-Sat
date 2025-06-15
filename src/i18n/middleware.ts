/**
 * i18n Middleware
 * This middleware sets up the language for the current request
 */
import { Request, Response, NextFunction } from 'express';
import { resolveLanguage, DEFAULT_LANGUAGE, LANGUAGE_OPTIONS } from './config';

/**
 * Middleware to handle language settings for the application
 * Priority: cookies > query parameters > default
 */
export function languageMiddleware(req: Request, res: Response, next: NextFunction) {
  // Get language from cookie or query parameter
  const cookieLang = req.cookies?.lang;
  const queryLang = req.query.lang as string;
  
  // Resolve the language to use
  const lang = resolveLanguage(cookieLang, queryLang);
  
  // If language comes from query parameter, update cookie for future requests
  if (queryLang && lang !== DEFAULT_LANGUAGE) {
    res.cookie('lang', lang, { 
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: false // Allow JavaScript access
    });
  }
  
  // Add language to res.locals for templates
  res.locals.lang = lang;
  res.locals.languages = LANGUAGE_OPTIONS; // Make language options available to all templates
  
  // Add it to response data for frontend
  res.locals.data = { 
    ...res.locals.data,
    lang,
    languages: LANGUAGE_OPTIONS
  };
  
  next();
}

export default languageMiddleware;
