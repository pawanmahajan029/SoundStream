import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure local upload directories exist
if (!fs.existsSync(path.join(uploadsDir, 'audio-files'))) {
    fs.mkdirSync(path.join(uploadsDir, 'audio-files'), { recursive: true });
}
if (!fs.existsSync(path.join(uploadsDir, 'posters'))) {
    fs.mkdirSync(path.join(uploadsDir, 'posters'), { recursive: true });
}

export function uploadAudioFileLocally(file, fileName) {
    return new Promise((resolve, reject) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const safeFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
        const savedFileName = `audio-${uniqueSuffix}-${safeFileName}`;
        const filePath = path.join(uploadsDir, 'audio-files', savedFileName);

        fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                console.error("Local audio write error:", err);
                reject(err);
            } else {
                resolve({ url: `/uploads/audio-files/${savedFileName}` });
            }
        });
    });
}

export function uploadPosterFileLocally(file, fileName) {
    return new Promise((resolve, reject) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const safeFileName = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
        const savedFileName = `poster-${uniqueSuffix}-${safeFileName}`;
        const filePath = path.join(uploadsDir, 'posters', savedFileName);

        fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                console.error("Local poster write error:", err);
                reject(err);
            } else {
                resolve({ url: `/uploads/posters/${savedFileName}` });
            }
        });
    });
}

export function deleteFileLocally(fileUrl) {
    if (!fileUrl) return;
    try {
        // e.g. http://localhost:3000/uploads/audio-files/audio-123.mp3
        const urlObj = new URL(fileUrl);
        const urlPath = urlObj.pathname; // /uploads/audio-files/audio-123.mp3

        if (urlPath.startsWith('/uploads/')) {
            const relativePath = urlPath.replace('/uploads/', ''); // audio-files/audio-123.mp3
            const absolutePath = path.join(uploadsDir, relativePath);

            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }
    } catch (error) {
        console.error("Error deleting local file:", fileUrl, error);
    }
}