import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabase';

/**
 * Compress image file on client side to maximum maxSizeMB (default 0.2 MB = 200 KB).
 */
export async function compressImage(file, maxSizeMB = 0.2, maxWidthOrHeight = 1600) {
  if (!file) return null;
  if (!file.type || !file.type.startsWith('image/')) return file;

  const options = {
    maxSizeMB: maxSizeMB, // 0.2 MB = 200 KB max limit
    maxWidthOrHeight: maxWidthOrHeight,
    useWebWorker: true,
    initialQuality: 0.8,
    fileType: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.warn('Auto image compression failed, using original file:', error);
    return file;
  }
}

/**
 * Extract relative file path inside Supabase Storage bucket from public URL or path string.
 */
export function extractStoragePath(urlOrPath, bucketName = 'images') {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null;
  const cleanStr = urlOrPath.trim();
  if (!cleanStr) return null;

  // Pattern 1: Public URL format (.../storage/v1/object/public/{bucketName}/{filePath})
  const publicMarker = `/storage/v1/object/public/${bucketName}/`;
  const publicIdx = cleanStr.indexOf(publicMarker);
  if (publicIdx !== -1) {
    const rawPath = cleanStr.substring(publicIdx + publicMarker.length);
    return rawPath.split('?')[0];
  }

  // Pattern 2: Signed URL format (.../storage/v1/object/sign/{bucketName}/{filePath})
  const signMarker = `/storage/v1/object/sign/${bucketName}/`;
  const signIdx = cleanStr.indexOf(signMarker);
  if (signIdx !== -1) {
    const rawPath = cleanStr.substring(signIdx + signMarker.length);
    return rawPath.split('?')[0];
  }

  // Pattern 3: Path starting with bucket name (e.g. "images/berita/abc.jpg")
  if (cleanStr.startsWith(`${bucketName}/`)) {
    return cleanStr.substring(bucketName.length + 1).split('?')[0];
  }

  // Pattern 4: Relative path already inside bucket (e.g. "berita/abc.jpg" or "iklan/abc.jpg")
  if (!cleanStr.startsWith('http://') && !cleanStr.startsWith('https://') && !cleanStr.startsWith('/')) {
    return cleanStr.split('?')[0];
  }

  return null;
}

/**
 * Physically remove image files from Supabase Storage bucket.
 */
export async function deleteStorageFiles(urlsOrPaths, bucketName = 'images') {
  if (!urlsOrPaths) return;
  const list = Array.isArray(urlsOrPaths) ? urlsOrPaths : [urlsOrPaths];

  const pathsToDelete = list
    .map(item => extractStoragePath(item, bucketName))
    .filter(path => path && path.trim() !== '');

  const uniquePaths = [...new Set(pathsToDelete)];

  if (uniquePaths.length === 0) return;

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove(uniquePaths);

    if (error) {
      console.warn(`[Storage Sync] Gagal hapus file fisik dari bucket ${bucketName}:`, error.message);
    } else {
      console.log(`[Storage Sync] Berhasil hapus ${uniquePaths.length} file fisik dari storage (${bucketName}):`, uniquePaths);
    }
  } catch (err) {
    console.error(`[Storage Sync] Error deleting files from storage:`, err);
  }
}
