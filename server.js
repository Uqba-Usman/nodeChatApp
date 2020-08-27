const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, "public")));

const botName = "CharCord Bot";

//Run when clients connect
io.on("connection", (socket) => {
  console.log("New WS Connection...");

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to chatcord!"));

    //Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );
  });

  //Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    console.log(msg);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //Runs when clients disconnect
  socket.on("disconnect", () => {
    const user = userLeaves(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
    }
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
