const Chat = require('../models/Chat'); // Import the Chat model

/**
 * Fetch chat history between two users in a specific room
 */
const getChatHistory = async (req, res) => {
  const { roomId } = req.params; // Room ID from URL parameters

  try {
    const chats = await Chat.findAll({
      where: { roomId }, // Filter by roomId
      order: [['timestamp', 'ASC']], // Order by timestamp (oldest first)
    });

    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (err) {
    console.error('Error fetching chat history:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history',
    });
  }
};

/**
 * Store a new chat message in the database
 */
const saveChatMessage = async (req, res) => {
  const { roomId, senderId, receiverId, message } = req.body;

  try {
    const newChat = await Chat.create({
      roomId,
      senderId,
      receiverId,
      message,
    });

    res.status(201).json({
      success: true,
      data: newChat,
      message: 'Chat message saved successfully',
    });
  } catch (err) {
    console.error('Error saving chat message:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save chat message',
    });
  }
};

module.exports = {
  getChatHistory,
  saveChatMessage,
};
