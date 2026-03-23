import express from 'express';
import {
    sendCollabRequest,
    getCollabInbox,
    getSentRequests,
    respondToCollabRequest
} from '../controllers/collabRequest.controller.js';
import { authMiddleware, requireCreator } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Listener sends a collab request
router.post('/', authMiddleware, sendCollabRequest);

// Listener views their sent requests
router.get('/sent', authMiddleware, getSentRequests);

// Creator views their incoming inbox
router.get('/inbox', authMiddleware, requireCreator, getCollabInbox);

// Creator accepts or rejects a request
router.put('/:id', authMiddleware, requireCreator, respondToCollabRequest);

export default router;
