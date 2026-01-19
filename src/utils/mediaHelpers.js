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
