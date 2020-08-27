const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

//Run when clients connect
io.on("connection", (socket) => {
  console.log("New WS Connection...");

  //Welcome current user
  socket.emit("message", "Welcome to chatcord!");

  //Broadcast when a user connects
  socket.broadcast.emit("message", "A user has joined the chat");

  //Runs when clients disconnect
  socket.on("disconnect", () => {
    io.emit("message", "A user has left the chat");
  });

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    console.log(msg);
    io.emit("message", msg);
  });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log("Server running  on port: ", PORT));

// io.on("connection", (socket) => {
//     console.log("New WS Connection...");

//        Message to one who connect
//     socket.emit("message", "Welcome to chatcord!");

//      Message to all except one who connect
//       socket.broadcast.emit()

//       Message to all in general
//       io.emit()
//   });
