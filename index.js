const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);

const gameObject = {
  participants: [],
  winner: null,
};

const checkResult = (value1, value2) => {
  if (value1 === "paper" && value2 === "scissors") {
    return 2;
  } else if (value1 === "paper" && value2 === "rock") {
    return 1;
  } else if (value1 === "scissors" && value2 === "rock") {
    return 2;
  } else if (value1 === "scissors" && value2 === "paper") {
    return 1;
  } else if (value1 === "rock" && value2 === "paper") {
    return 2;
  } else if (value1 === "rock" && value2 === "scissors") {
    return 1;
  }
  return 0;
};
const allowedFrontendHost=process.env.ALLOWED_FRONTEND_HOST
const io = new Server(server, {
  cors: {
    origin: allowedFrontendHost,
  },
});

io.on("connection", (socket) => {

  socket.on("send-message", (data) => {
    // fist player 
    // add is data to the data base and braocast a message
    if (gameObject.participants.length == 0) {
      gameObject.participants.push({ id: socket.id, choice: data.value });
      socket.broadcast.emit("receive_message", data);
      return;
    }
    const playerPlayed = gameObject.participants.filter(p =>{
        return p.id === socket.id
    })

    if (playerPlayed.length >= 1){
        socket.emit("receive_error", {message: "You have played already"})
        return
    }
    gameObject.participants.push({ id: socket.id, choice: data.value });
    player1 = gameObject.participants[0].choice;
    player2 = gameObject.participants[1].choice;
    const winner = checkResult(player1, player2);
    const responseData = {
      message: `The Player${winner} wins, deatail player 1 choose ${player1} and player 2 choose ${player2}`,
    };

    socket.broadcast.emit("receive_error", responseData);
    gameObject.participants = []
  });
  
  socket.on("join-room", (data) => {
    socket.join(data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/", (req, res) => {
  res.send("yes");
});
const PORT = process.env.PORT || 8000;
server.listen(3001, () => {
  console.log(`server is listening ${PORT} and front is on ${allowedFrontendHost}`);
});
