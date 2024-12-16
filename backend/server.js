const express = require('express');
const { Server } = require('socket.io'); 
const http = require('http'); 
const sequelize = require('./Config/dbconfig'); 
const cors = require('cors');
const bodyParser = require('body-parser'); 
const configureSocket = require('./Config/socket'); 

const PORT = 8989;

// Initialize Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

// Routes
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/patient', patientRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/chats', chatRoutes);

// Create HTTP Server and Attach Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});


configureSocket(io);

// Sync Sequelize and Start Server
sequelize.sync() 
  .then(() => {
    server.listen(PORT, () => { 
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
