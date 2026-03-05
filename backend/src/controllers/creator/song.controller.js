import { uploadAudioFileLocally, uploadPosterFileLocally, deleteFileLocally } from '../../services/storage.service.js';
import { getSongById, uploadSong, deleteSongById } from '../../dao/song.dao.js';

export async function uploadSongController(req, res) {
    const { title, artist } = req.body;

    if (!req.files || !req.files.audio || !req.files.poster) {
        return res.status(400).json({
            message: "Both audio and poster files are required"
        });
    }

    try {
        const audioFile = await uploadAudioFileLocally(req.files.audio[0], req.files.audio[0].originalname);
        const posterFile = await uploadPosterFileLocally(req.files.poster[0], req.files.poster[0].originalname);

        const song = await uploadSong({
            title: title,
            artist: artist,
            audio: audioFile.url,
            poster: posterFile.url,
            user: req.user._id
        });

        res.status(201).json({
            message: "Song uploaded successfully",
            song
        });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            message: "Error uploading song",
            error: error.message
        });
    }
}

export async function deleteSongController(req, res) {
    const { id } = req.params;

    try {
        const song = await getSongById(id);
        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        // Check if the user is the owner (skip check for legacy songs with no user set)
        if (song.user && song.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden: You don't have permission to delete this song" });
        }

        // Delete associated files from local /uploads directory
        if (song.audio) {
            deleteFileLocally(song.audio);
        }
        if (song.poster) {
            deleteFileLocally(song.poster);
        }

        // Delete song document from MongoDB
        await deleteSongById(id);

        res.status(200).json({
            message: "Song deleted successfully",
            deletedSongId: id
        });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({
            message: "Error deleting song",
            error: error.message
        });
    }
}
