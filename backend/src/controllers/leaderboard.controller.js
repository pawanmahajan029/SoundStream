import mongoose from 'mongoose';
import { recordPlay, getTopListeners } from '../dao/leaderboard.dao.js';

// POST /leaderboard/play — listener records a play event
export const recordPlayController = async (req, res) => {
    try {
        const { songId, creatorId } = req.body;

        if (!songId || !creatorId) {
            return res.status(400).json({ message: 'songId and creatorId are required.' });
        }

        await recordPlay({
            userId: req.user._id,
            songId,
            creatorId
        });

        res.status(200).json({ message: 'Play recorded.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to record play.', error: error.message });
    }
};

// GET /leaderboard/:creatorId — get top 5 listeners for a creator
export const getLeaderboardController = async (req, res) => {
    try {
        const { creatorId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(creatorId)) {
            return res.status(400).json({ message: 'Invalid creator ID.' });
        }

        const topListeners = await getTopListeners(new mongoose.Types.ObjectId(creatorId));
        res.status(200).json({ topListeners });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch leaderboard.', error: error.message });
    }
};
