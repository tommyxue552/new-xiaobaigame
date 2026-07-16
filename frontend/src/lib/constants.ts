/** API base URL */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/** Public site URL (used for canonical URLs, sitemaps, OG tags) */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.xiaobaigame.com";

/** Maximum file upload size in bytes (100 MB) */
export const MAX_UPLOAD_SIZE = 100 * 1024 * 1024;

/** Allowed file extensions for upload */
export const ALLOWED_UPLOAD_EXTENSIONS = [
  ".zip", ".rar", ".7z", ".tar.gz", ".tar.xz",
  ".jpg", ".jpeg", ".png", ".gif", ".webp",
];

/** Site name */
export const SITE_NAME = "xiaobaigame";

/** Site default description */
export const SITE_DESCRIPTION =
  "Discover and share game resources — mods, saves, tools, and more. A community-driven platform for game resource sharing.";
