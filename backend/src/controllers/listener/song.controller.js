import { getSongById, getAllSongs, searchSongs } from '../../dao/song.dao.js';

export async function getAllSongsController(req, res) {
    const songs = await getAllSongs();

    res.status(200).json({
        message: "Songs fetched successfully",
        songs
    });
}

export async function searchSongsController(req, res) {
    const query = req.query.keyword;

    const songs = await searchSongs({
        $or: [
            {
                title: {
                    $regex: query,
                    $options: 'i'
                }
            },
            {
                artist: {
                    $regex: query,
                    $options: 'i'
                }
            }
        ]
    })

    res.status(200).json({
        message: "Songs fetched successfully",
        songs
    });
}

export async function getSongByIdController(req, res) {
    const { id } = req.params;

    try {
        const song = await getSongById(id);

        if (!song) {
            return res.status(404).json({
                message: "Song not found"
            });
        }

        res.status(200).json({
            message: "Song fetched successfully",
            song
        });
    }

    catch (error) {
        return res.status(400).json({
            message: "Invalid song ID format"
        });
    }
}
