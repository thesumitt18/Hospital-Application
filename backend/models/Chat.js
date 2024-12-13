const { DataTypes } = require('sequelize');
const sequelize = require('../Config/dbconfig'); // Update with your DB config file path

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  roomId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'chats',
  timestamps: false,
  indexes: [
    {
      unique: false, // Can be true if you want to enforce unique roomId
      fields: ['roomId'],
    }
  ],
});

module.exports = Chat;
