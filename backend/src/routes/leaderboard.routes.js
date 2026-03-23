import express from 'express';
import { recordPlayController, getLeaderboardController } from '../controllers/leaderboard.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Record a play event (any authenticated user)
router.post('/play', authMiddleware, recordPlayController);

// Get top listeners for a creator
router.get('/:creatorId', authMiddleware, getLeaderboardController);

export default router;
