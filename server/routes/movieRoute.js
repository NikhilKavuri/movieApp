import express from 'express';
import { Login, searchMovie, signUp } from '../controller/Movie.js';
const router = express.Router();

router.post('/login',Login)
router.post('/signup',signUp)
router.post('/movie',searchMovie)
export default router;