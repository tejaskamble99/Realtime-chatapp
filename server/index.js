const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app = express();
const port = 4500;

const users = {};

app.use(cors());

app.get("/", (req, res) => {
  res.send("HELL ITS WORKING");
});

const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173", // Make sure this matches your Frontend URL
    methods: ["GET", "POST"]
  }
});

// === EVERYTHING MUST BE INSIDE THIS FUNCTION ===
io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);

    socket.broadcast.emit("userJoined", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });

    socket.emit("welcome", {
      user: "Admin",
      message: `Welcome to the chat, ${users[socket.id]}`,
    });
  });

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[id], message, id });
  });

  socket.on("disconnect", () => {
    if (users[socket.id]) {
      socket.broadcast.emit("leave", {
        user: "Admin",
        message: `${users[socket.id]} has left`,
      });
      console.log(`${users[socket.id]} left`);
      delete users[socket.id];
    }
  });
  socket.on("typing", () => {
    socket.broadcast.emit("typing", { user: users[socket.id] });
 console.log("typing");
});
});

 // <--- The connection block ENDS here

server.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});