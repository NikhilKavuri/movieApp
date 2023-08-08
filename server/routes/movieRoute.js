import express from 'express';
import { Login, privatePlaylist, publicPlaylist, searchMovie, signUp, viewPrivate, viewPublic } from '../controller/Movie.js';
const router = express.Router();

router.post('/login',Login)
router.post('/signup',signUp)
router.post('/movie',searchMovie)
router.post('/publicplaylist',publicPlaylist)
router.post('/privateplaylist',privatePlaylist)
router.get('/viewpublic',viewPublic)
router.post('/viewprivate',viewPrivate)
export default router;