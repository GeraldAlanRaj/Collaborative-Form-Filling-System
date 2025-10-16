// server.js
const express = require('express');
require("dotenv").config();
const MongoDB = require('./config/db.js');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/authRoutes.js');
const formRoutes = require('./routes/formRoutes.js');
const setupSocket = require('./socket.js');

// ---- Prometheus instrumentation ----
const client = require('prom-client');

client.collectDefaultMetrics({ timeout: 5000 }); // default Node.js & process metrics

const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [50, 100, 200, 300, 500, 1000, 2000] // ms
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// ---- App setup ----
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// instrumentation middleware
app.use((req, res, next) => {
  const end = httpRequestDurationMs.startTimer();
  res.on('finish', () => {
    const route = req.route && req.route.path ? req.route.path : req.path;
    httpRequestsTotal.inc({ method: req.method, route, status_code: res.statusCode });
    end({ method: req.method, route, status_code: res.statusCode });
  });
  next();
});

// Expose metrics
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// DB, routes, sockets
MongoDB();

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);

setupSocket(io);

// start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
