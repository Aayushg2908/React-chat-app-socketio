const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const port = 4500;

const users = [{}];

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const server = http.createServer(app);

const io = new Server(server, { cors: { origin: '*' } });

io.on("connection", (socket) => {
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]}`,
    });
  });
  socket.on('message', ({message, id})=>{
    io.emit('sendMessage', {user:users[id], message, id})
  })
  socket.on('disconnect', ()=>{
    socket.broadcast.emit('leave', {user:"Admin", message:`${users[socket.id]} has left`})
  })
});

server.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
