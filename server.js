const express = require("express");
const app = express();
const server = require("http").Server(app);
const PORT = 5500 || 4000;
const { ExpressPeerServer } = require("peer")
const peerServer = ExpressPeerServer(server,{
    debug:true
})
const { v4: uuidv4 } = require("uuid");
const io = require("socket.io")(server);

// set view engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use('/peerjs',peerServer)



app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId,userId) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-connected");
    socket.broadcast.emit("user-connected",userId);
  });
});

// io.on("connection", (socket) => {
//   const roomId = "yourRoomId";

//   // ... other event handling and logic ...
// });

server.listen(PORT, () => {
  console.log(`SERVER LISTENING ON PORT ${PORT}`);
});
