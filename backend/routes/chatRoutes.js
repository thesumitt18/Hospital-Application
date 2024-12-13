const express = require('express');
const { getChatHistory, saveChatMessage } = require('../controller/chatController'); // Import controller functions

const router = express.Router();

// Route to fetch chat history for a specific room
// GET /api/chats/:roomId
router.get('/:roomId', getChatHistory);

// Route to save a new chat message
// POST /api/chats
router.post('/', saveChatMessage);

module.exports = router;
