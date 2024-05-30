
// module.exports = app;
const express = require("express");
const dotenv = require("dotenv");
const databaseConnection = require("./database/db");
const cors = require("cors");
const multiparty = require("connect-multiparty");
const morgan = require("morgan");
const cloudinary = require("cloudinary").v2;
const path = require('path');
const fs = require('fs');
const https = require('https');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const socketIo = require("socket.io");
const{ createlogger, transport, format} = require("winston")
require("winston-mongodb")

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsPolicy = {
  origin: ["https://localhost:3000"],
  methods:["GET","POST","PUT","DELETE"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsPolicy));

// HTTPS server setup
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, './.cert/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './.cert/cert.pem'))
};

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Database connection
databaseConnection();

// Middleware setup
app.use(multiparty());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Session middleware setup (before routes)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: true,
    maxAge: 30000 * 60 * 60 * 24, // 30 days
    httpOnly: false,
    sameSite: 'lax'
  }
}));

// Routes
app.use("/api", require("./Routes/signUpRoute"));
app.use("/api", require("./Routes/LoginRoute"));
app.use("/api/user/", require("./Routes/ForgetPasswordRoute")); // Ensure this is correct
app.use("/api/profile", require("./Routes/ProfileRoutes"));
app.use("/api/questions", require("./Routes/QuestionsRoute"));

// New route for the test case
app.get("/test", (req, res) => {
  res.status(200).send("hello");
});

// HTTPS server
const port = process.env.PORT || 5500;
const server = https.createServer(httpsOptions, app);

server.listen(port, () => {
  console.log(`Development Server is running on port ${port}`);
});

// Socket.io setup
const io = socketIo(server, {
  pingTimeout: 6000,
  cors: {
    origin: true,
  },
});

// Socket.io connection
io.on("connection", (socket) => {
  let userId;

  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    userId = userData._id;
    socket.broadcast.emit("userId", userId);
    console.log(userData._id + " from socket");
    socket.emit("connected");
  });

  socket.on("new reply", (replyData) => {
    console.log(replyData);
    const { users, reply } = replyData;
    users.forEach((user) => {
      console.log("outside if" + user._id);
      if (userId !== user._id) {
        socket.emit("new reply", replyData); // Emits to all users except the current socket (logged-in user)
        console.log("inside if" + user._id);
      }
    });
  });
});



module.exports = app;
