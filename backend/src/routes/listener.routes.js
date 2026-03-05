import express from 'express';
import { getAllSongsController, getSongByIdController, searchSongsController } from '../controllers/listener/song.controller.js';

const router = express.Router();

router.get('/', getAllSongsController);
router.get('/search', searchSongsController);
router.get('/:id', getSongByIdController);

export default router;
