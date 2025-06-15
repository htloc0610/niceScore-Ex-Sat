import { Request, Response } from "express";

/**
 * Helper to add language information to view rendering
 * 
 * @param req Express Request object
 * @param res Express Response object 
 * @param viewName Name of the view to render
 * @param viewData Data to pass to the view
 */
export function renderWithLanguage(
  req: Request, 
  res: Response, 
  viewName: string, 
  viewData: Record<string, any> = {}
): void {
  // Get language from res.locals (set by middleware)
  const lang = res.locals.lang || 'en';
  
  // Add language to view data
  const dataWithLanguage = {
    ...viewData,
    lang
  };
  
  // Render the view with language
  res.render(viewName, dataWithLanguage);
}
