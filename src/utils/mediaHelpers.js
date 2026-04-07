/**
 * Media utility functions for handling images and videos
 */

/**
 * Check if a URL is a video
 * @param {string} url - The media URL to check
 * @returns {boolean} - True if the URL is a video, false otherwise
 */
export const isVideo = (url) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    const hasVideoExtension = videoExtensions.some((ext) =>
        lowerUrl.includes(ext)
    );
    // Check for Cloudinary video URLs (they contain 'video/upload' not just 'upload')
    const isCloudinaryVideo = lowerUrl.includes("video/upload");

    return hasVideoExtension || isCloudinaryVideo;
};

/**
 * Get the media type (video or image)
 * @param {string} url - The media URL
 * @returns {string} - 'video' or 'image'
 */
export const getMediaType = (url) => {
    return isVideo(url) ? "video" : "image";
};

/**
 * Get optimized Cloudinary image URL for faster loading
 * @param {string} url - Original image URL
 * @param {number} width - Target width (default: 600)
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (url, width = 600) => {
    if (!url || !url.includes("cloudinary.com")) return url;
    // Insert optimization params: f_auto (auto format), q_auto (auto quality), w_<width>
    return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width},c_fill/`);
};
