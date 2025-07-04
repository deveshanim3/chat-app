const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const compileRoutes = require('./compile');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use('/api', compileRoutes);

// Socket.io logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(`${socket.id} joined room ${roomId}`);
  });

  // Chat message
  socket.on("send-message", ({ roomId, message }) => {
    socket.to(roomId).emit("receive-message", {
      sender: socket.id,
      message
    });
  });
  
  // Code change (live collaboration)
  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("receive-code", code);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(5000, () => console.log('Server running on http://localhost:5000'));
