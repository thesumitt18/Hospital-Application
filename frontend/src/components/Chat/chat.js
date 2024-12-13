import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import http from '../axiosInstance';
import './chat.css';
import { useParams } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';

const socket = io('http://localhost:8989');

const Chat = () => {
  const { detail, roomId } = useParams();
  let senderId = '';
  let receiverId = '';
  if(detail === 'doctor'){
    senderId = roomId.charAt(1);
    receiverId = roomId.charAt(0);
  }else{
    senderId = roomId.charAt(0);
    receiverId = roomId.charAt(1);
  }

  const [receiver, setReciever] = useState(''); 
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messageInputRef = useRef(null);
  const role = localStorage.getItem('role');
  
  useEffect(() => {
    http.get(`/${role === 'doctor' ? 'patient' : 'doctor'}/${receiverId}`).then(response => {
      setReciever(response.name);
    });
  }, []);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await http.get(`/chats/${roomId}`);
        setMessages(response.data); 
      } catch (error) {
        console.error('Error fetching chat history', error);
      }
    };

    fetchChatHistory();

    socket.emit('joinRoom', roomId);

    socket.on('receiveMessage', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { senderId: data.senderId, message: data.message, timestamp: data.timestamp },
      ]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMessage = {
      roomId,
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(), 
    };

    try {

      socket.emit('sendMessage', newMessage);

      setMessage('');
      messageInputRef.current.focus();
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  // Format the timestamp for time-only display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with {receiver}</h2>
      </div>
      <div className="chat-history">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.senderId === senderId ? 'sent' : 'received'}`}>
            <p>{msg.message}</p>

            <small className="timestamp">{formatTimestamp(msg.timestamp)}</small>
          </div>
        ))}
      </div>
      <div className="chat-footer">
        <input
          ref={messageInputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
        <MicIcon sx={{ height: '25px', width: '25px', border: '1px solid black', borderRadius: '50%', padding: '5px', marginLeft: '10px' }} data-testid="MicIcon" />

      </div>
    </div>
  );
};

export default Chat;
