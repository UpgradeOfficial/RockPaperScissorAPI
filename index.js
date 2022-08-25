const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { Server } = require("socket.io");
const connectDB = require("./config/dbConfig");
const corsOptions = require("./config/corsOptions");
const cookieParser = require("cookie-parser");
const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require('swagger-jsdoc');



const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'RPC Game',
      version: '1.0.0',
    }
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/**/*.js', './index.js'],
};

const swaggerSpec = swaggerJSDoc(options);
// routes imports
const registerRoutes = require("./routes/auth/register");
const loginRoutes = require("./routes/auth/login");
const userRoutes = require("./routes/user/userRoute");
const verifyJWT = require("./middlewares/verifyJWT");

const app = express();
const server = http.createServer(app);

// Intial Connection To dataBase
connectDB()
// CORS Policy
app.use(cors(corsOptions));
// built in middle ware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());



// custom routes
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use(verifyJWT);
app.use("/user", userRoutes);

app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// catch all 
app.all("*", (req, res) => {
  // this will handle all the other routes to the page
  // by default this will send a 200
  // we need to chain in a status of 404
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, 'public', "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found!!!" });
  } else {
    res.type("txt").send("404 Not Found");
  }
  //sendFile()
});

































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
console.log(allowedFrontendHost)
const io = new Server(server, {
  cors: {
    origin:allowedFrontendHost,
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


const PORT = process.env.PORT || 8000;

mongoose.connection.once("open", () => {
  console.log("Connected to mongodb");
  server.listen(PORT, () => {
    console.log(`server is listening ${PORT} and front is on ${allowedFrontendHost}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("err Connected to mongodb");
  console.log(err);
});



