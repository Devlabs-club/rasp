import express from 'express';
import { getMessages, getChats, saveMessages } from '../controllers/chatController.js';

const router = express.Router();

router.get('/get/:sender/:receiver', getMessages);
router.get('/getall/:userId', getChats);
router.post('/save/:sender/:receiver', saveMessages);

export default router;