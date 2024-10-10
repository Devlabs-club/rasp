import express from 'express';
import { getMessages, getChats, saveMessage, createChat } from '../controllers/chatController.js';

const router = express.Router();

router.get('/get/:chatId', getMessages);
router.get('/getall/:userId', getChats);
router.post('/save/:chatId', saveMessage);
router.post('/create', createChat);

export default router;