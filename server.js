require("dotenv").config();
require("express-async-errors");
const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const sendEmail = require("./utils/email");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);

app.use(cors(corsOptions));
// this is used for form data
app.use(express.urlencoded({ extended: false }));
// parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// app.use(express.json())

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/admin", require("./routes/generalRoutes"));

app.post("/forgot-password", async (req, res) => {
  const {email} = req.body
  // await sendEmail(
  //   email,
  //   "Forgot Password",
  //   "this is the fucking messagemessage"
  // );
  console.log(email)
  res.json({ message: "the is a test" });
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

const { allowedFrontendHost } = require("./utils/literals");

const { checkResult } = require("./utils/gameMethods");
const io = new Server(server, {
  cors: {
    origin: allowedFrontendHost,
  },
});

const gameObject = {
  participants: [],
  winner: null,
};



io.on("connection", (socket) => {
  console.log("connected")
  socket.on("send-message", (data) => {
    // fist player
    // add is data to the data base and braocast a message
    console.log("send message", data)
    if (gameObject.participants.length == 0) {
      gameObject.participants.push({ id: socket.id, choice: data.value });
      socket.broadcast.emit("receive_message", data);
      return;
    }
    const playerPlayed = gameObject.participants.filter((p) => {
      return p.id === socket.id;
    });

    if (playerPlayed.length >= 1) {
      socket.emit("receive_error", { message: "You have played already bitch" });
      return;
    }
    gameObject.participants.push({ id: socket.id, choice: data.value });
    player1 = gameObject.participants[0].choice;
    player2 = gameObject.participants[1].choice;
    const winner = checkResult(player1, player2);
    const responseData = {
      message: `The Player${winner} wins, deatail player 1 choose ${player1} and player 2 choose ${player2}`,
    };

    socket.broadcast.emit("receive_error", responseData);
    gameObject.participants = [];
  });

  socket.on("join-room", (data) => {
    socket.join(data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

module.exports = app;
