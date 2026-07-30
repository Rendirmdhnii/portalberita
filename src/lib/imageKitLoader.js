export const IMAGEKIT_BASE_URL = 'https://ik.imagekit.io/pojoktv';
export const SUPABASE_OLD_BASE_URL = 'https://qhtwymloyulvyctztktd.supabase.co/storage/v1/object/public';

/**
 * Replaces all Supabase Storage URLs inside an HTML string (e.g., Quill editor content)
 * with ImageKit CDN URLs.
 *
 * @param {string} htmlString - Raw HTML content
 * @returns {string} HTML content with replaced image URLs
 */
export function transformHtmlImageUrls(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') return htmlString || '';

  return htmlString
    // Replace full Supabase URLs (including any custom domain or env var URL)
    .replace(/https?:\/\/[^\/]+\/storage\/v1\/object\/public/gi, IMAGEKIT_BASE_URL)
    // Replace absolute relative paths /storage/v1/object/public
    .replace(/\/storage\/v1\/object\/public/gi, IMAGEKIT_BASE_URL)
    // Replace relative paths inside img src attribute without leading slash (e.g., src="storage/v1/object/public/...")
    .replace(/(<img[^>]+src=["'])(storage\/v1\/object\/public\/)([^"']+["'])/gi, `$1${IMAGEKIT_BASE_URL}/$3`);
}

/**
 * Utility function and Next.js image loader that replaces Supabase Storage URLs
 * with the new ImageKit CDN URL (https://ik.imagekit.io/pojoktv).
 *
 * Supports both direct string invocation: imageKitLoader(url)
 * and Next.js loader signature: imageKitLoader({ src, width, quality })
 *
 * @param {string|object} srcParam - Image URL string or Next.js loader object
 * @returns {string} Transformed ImageKit CDN URL
 */
export function imageKitLoader(srcParam) {
  if (!srcParam) return '';

  let src = typeof srcParam === 'object' && srcParam !== null ? srcParam.src : srcParam;

  if (typeof src !== 'string' || !src.trim()) return '';

  let url = src.trim();

  // If passed an HTML string containing image tags (e.g. Quill content), transform HTML
  if (url.includes('<img') || (url.includes('<') && url.includes('>'))) {
    return transformHtmlImageUrls(url);
  }

  // 1. Replace full Supabase domain storage public URLs
  // e.g. https://qhtwymloyulvyctztktd.supabase.co/storage/v1/object/public/... -> https://ik.imagekit.io/pojoktv/...
  url = url.replace(/https?:\/\/[^\/]+\/storage\/v1\/object\/public/gi, IMAGEKIT_BASE_URL);

  // 2. Replace relative storage public paths
  // e.g. /storage/v1/object/public/... or storage/v1/object/public/... -> https://ik.imagekit.io/pojoktv/...
  url = url.replace(/^\/?storage\/v1\/object\/public/gi, IMAGEKIT_BASE_URL);

  // 3. If relative path starting with bucket name (e.g. 'images/...' or 'ads/...')
  if (url.startsWith('/images/') || url.startsWith('images/') || url.startsWith('/ads/') || url.startsWith('ads/')) {
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    url = `${IMAGEKIT_BASE_URL}${cleanPath}`;
  }

  return url;
}

export default imageKitLoader;
