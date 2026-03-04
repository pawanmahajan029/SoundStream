import express from 'express';
import { uploadSongController, getAllSongsController, getSongByIdController, searchSongsController, deleteSongController } from '../controllers/song.controller.js';
import multer from "multer";              // Express by default can not read file, so we use multer middleware to handle file uploads
import { authMiddleware, requireArtist } from '../middlewares/auth.middleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// multer middleware to handle file uploads
router.post('/upload',                      // api
    authMiddleware, requireArtist,
    upload.fields([                         // middleware ( multer middleware to handle multiple file uploads with field names 'audio' and 'poster')
        { name: 'audio', maxCount: 1 },
        { name: 'poster', maxCount: 1 }
    ]),
    uploadSongController                           // controller
);

router.get('/', getAllSongsController);

router.get('/search', searchSongsController);

router.get('/:id', getSongByIdController);    // Note-2: This api should be written at the end of the file because it has a parameter ':id' which can match any string, so if we write it before the other routes, it will match all the requests and will not reach the other routes. So, we write it at the end to avoid this issue. // Note-1 This is a dynamic route, where :id is a placeholder for the song ID. It will match any URL like /song/12345, where 12345 is the song ID.          

router.delete('/:id', authMiddleware, requireArtist, deleteSongController);

export default router;