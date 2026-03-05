import express from 'express';
import { uploadSongController, deleteSongController } from '../controllers/creator/song.controller.js';
import multer from "multer";
import { authMiddleware, requireCreator } from '../middlewares/auth.middleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/upload',
    authMiddleware, requireCreator,
    upload.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'poster', maxCount: 1 }
    ]),
    uploadSongController
);

router.delete('/:id', authMiddleware, requireCreator, deleteSongController);

export default router;
