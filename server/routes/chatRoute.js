import express from 'express';
import { getMessages, saveMessages } from '../controllers/chatController.js';

const router = express.Router();

router.get('/get/:sender/:receiver', getMessages);
router.post('/save/:sender/:receiver', saveMessages);

export default router;