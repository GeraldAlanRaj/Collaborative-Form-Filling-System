const express = require('express');
const MongoDB = require('./config/db.js')
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');
const formRoutes = require('./routes/formRoutes.js');
const setupSocket = require('./socket.js')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ['GET', 'POST']
  }
});
app.use(cors());
app.use(express.json());

MongoDB();

app.use('/api/forms', formRoutes);

setupSocket(io);

server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
