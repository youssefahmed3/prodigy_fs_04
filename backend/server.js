const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import cors

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
  }
});

// Apply CORS middleware to Express routes
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.get("/", (req, res) => {
  res.send("Hello from the Express server!");
});

io.on("connection", (socket) => {
  console.log(`A user connected : ${socket.id}`);

  socket.on("join_room", (room) => {
    console.log(`User [${socket.id}] joined room ${room}`);
    socket.join(room);
  });

  socket.on("send_message", (messageObj) => {
    console.log("Message received:", messageObj);
    io.to(messageObj.chatId).emit("received_message", messageObj); // Emit the message to specific room 
  });


  socket.on("leave_room", (id) => {
    socket.leave(id);
  })

  socket.on("disconnect", () => {
    console.log(`A user disconnected : ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});