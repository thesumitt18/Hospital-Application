const Chat = require('../models/Chat'); // Import Chat model

const configureSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Event: Send Message
    socket.on('sendMessage', async ({ roomId, senderId, receiverId, message }) => {
      try {
        // Save the message to the database
        const chat = await Chat.create({
          roomId,
          senderId,
          receiverId,
          message,
        });
        console.log(`Message saved to DB: ${message}`);

        // Emit the message to all participants in the room
        io.to(roomId).emit('receiveMessage', { senderId, message,receiverId, timestamp:chat.timestamp });
      } catch (err) {
        console.error('Error saving message:', err);
      }
    });

    // Event: Join Room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User joined room: ${roomId}`);
    });

    // Event: Disconnect
    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });
};

module.exports = configureSocket;
