import { AnalyzeResult } from '@backstage/plugin-catalog-import';

/**
 * Scrolls to the top of the page smoothly
 */
export const scrollToTop = () => {
  const article = document.querySelector('article');
  if (article && article.parentElement) {
    article.parentElement.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/**
 * Extracts the repository name from a GitHub URL
 * @param url - The GitHub repository URL
 * @returns The repository name or empty string if not found
 */
export const getDefaultNameFromUrl = (url: string): string => {
  const regexMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  return regexMatch?.[2] || '';
};

/**
 * Gets the submit URL from analysis result
 * @param analysisResult - The analysis result from catalog import API
 * @returns The URL to submit to
 */
export const getSubmitUrl = (analysisResult: AnalyzeResult): string => {
  if (analysisResult.type === 'locations') {
    return analysisResult.locations[0].target;
  }
  return analysisResult.url;
};
