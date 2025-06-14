const express = require('express');
require("dotenv").config();
const MongoDB = require('./config/db.js')
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const authRoutes = require('./routes/authRoutes.js');
const formRoutes = require('./routes/formRoutes.js');
const setupSocket = require('./Socket.js')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

app.use(cors(
  {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

MongoDB();

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);

setupSocket(io);

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
