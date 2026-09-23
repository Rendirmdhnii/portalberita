// Base URL Supabase Storage
const SUPABASE_BASE_URL = (
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhtwymloyulvyctztktd.supabase.co'
).replace(/\/$/, '');

export const SUPABASE_STORAGE_BASE_URL = `${SUPABASE_BASE_URL}/storage/v1/object/public`;
export const SUPABASE_PUBLIC_BUCKET_URL = `${SUPABASE_STORAGE_BASE_URL}/images/`;

// Backward-compatibility exports (tetap sediakan IMAGEKIT_BASE_URL & SUPABASE_OLD_BASE_URL agar aman)
export const IMAGEKIT_BASE_URL = 'https://qhtwymioyulvyctztktd.supabase.co/storage/v1/object/public/images';
export const SUPABASE_OLD_BASE_URL = SUPABASE_STORAGE_BASE_URL;

/**
 * Replaces all ImageKit URLs and relative storage paths inside an HTML string (e.g., Quill editor content)
 * directly with Supabase Storage Public Bucket URLs.
 *
 * @param {string} htmlString - Raw HTML content
 * @returns {string} HTML content with replaced image URLs
 */
export function transformHtmlImageUrls(htmlString) {
  if (!htmlString || typeof htmlString !== 'string') return htmlString || '';

  return htmlString
    // 1. Bersihkan parameter transformasi ImageKit (misal ?tr=... atau &tr=...)
    .replace(/(src=["'][^"']*?)([?&]tr=[^"'& \t\n\r]*)([^"']*?["'])/gi, '$1$3')
    // 2. Ganti pemanggilan ImageKit dengan bucket Supabase langsung
    .replace(/https?:\/\/ik\.imagekit\.io\/pojoktv\/images\/?/gi, `${SUPABASE_PUBLIC_BUCKET_URL}`)
    .replace(/https?:\/\/ik\.imagekit\.io\/pojoktv\/?/gi, `${SUPABASE_PUBLIC_BUCKET_URL}`)
    // 3. Normalisasi domain Supabase jika ada typo
    .replace(/qhtwymioyulvyctztktd\.supabase\.co/gi, 'qhtwymloyulvyctztktd.supabase.co')
    // 4. Pastikan path relatif /storage/v1/object/public diarahkan ke Supabase
    .replace(/(<img[^>]+src=["'])\/?storage\/v1\/object\/public\/?([^"']*["'])/gi, `$1${SUPABASE_STORAGE_BASE_URL}/$2`)
    // 5. Pastikan path relatif /images/ diarahkan ke Supabase
    .replace(/(<img[^>]+src=["'])\/?images\/([^"']*["'])/gi, `$1${SUPABASE_STORAGE_BASE_URL}/images/$2`);
}

/**
 * Utility function dan Next.js loader untuk bypass ImageKit dan tembak langsung ke Supabase Public Bucket.
 *
 * Supports both direct string invocation: imageKitLoader(url)
 * and Next.js loader signature: imageKitLoader({ src, width, quality })
 *
 * @param {string|object} srcParam - Image URL string or Next.js loader object
 * @returns {string} Direct Supabase Public Bucket URL
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

  // 1. Bersihkan parameter transformasi ImageKit (e.g. ?tr=f-jpg,w-800)
  url = url.replace(/([?&])tr=[^&\s]+/gi, '');
  url = url.replace(/[?&]$/, '');

  // 2. Ganti pemanggilan domain ImageKit langsung ke Supabase Storage
  if (/https?:\/\/ik\.imagekit\.io\/pojoktv\/?/i.test(url)) {
    url = url.replace(/https?:\/\/ik\.imagekit\.io\/pojoktv\/images\/?/gi, `${SUPABASE_PUBLIC_BUCKET_URL}`);
    url = url.replace(/https?:\/\/ik\.imagekit\.io\/pojoktv\/storage\/v1\/object\/public\/?/gi, `${SUPABASE_STORAGE_BASE_URL}/`);
    url = url.replace(/https?:\/\/ik\.imagekit\.io\/pojoktv\/?/gi, `${SUPABASE_PUBLIC_BUCKET_URL}`);
  }

  // 3. Normalisasi domain jika ada typo
  url = url.replace(/qhtwymioyulvyctztktd\.supabase\.co/gi, 'qhtwymloyulvyctztktd.supabase.co');

  // 4. Tangani relative storage public paths
  url = url.replace(/^\/?storage\/v1\/object\/public\/?/gi, `${SUPABASE_STORAGE_BASE_URL}/`);

  // 5. Tangani relative path yang diawali dengan nama bucket (e.g. 'images/...' atau 'ads/...')
  if (url.startsWith('/images/') || url.startsWith('images/')) {
    const cleanPath = url.replace(/^\/?images\//, '');
    url = `${SUPABASE_STORAGE_BASE_URL}/images/${cleanPath}`;
  } else if (url.startsWith('/ads/') || url.startsWith('ads/')) {
    const cleanPath = url.replace(/^\/?ads\//, '');
    url = `${SUPABASE_STORAGE_BASE_URL}/images/ads/${cleanPath}`;
  }

  // Rapikan double slash selain pada protokol (https://)
  url = url.replace(/([^:])\/{2,}/g, '$1/');

  return url;
}

export default imageKitLoader;
