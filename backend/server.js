const express = require('express');
const { Server } = require('socket.io'); // Import Socket.IO
const http = require('http'); // Import HTTP to create the server
const sequelize = require('./Config/dbconfig'); // Sequelize configuration
const cors = require('cors');
const bodyParser = require('body-parser'); // Missing import
const configureSocket = require('./Config/socket'); // Socket.IO configuration file

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
    origin: '*', // Update with your frontend origin
    methods: ['GET', 'POST'],
  },
});

// Configure Socket.IO
configureSocket(io);

// Sync Sequelize and Start Server
sequelize.sync() 
  .then(() => {
    server.listen(PORT, () => { // Use `server.listen` to bind HTTP and Socket.IO
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
