const express = require("express");
const dotenv = require("dotenv");
const databaseConnection = require("./database/db");
const cors = require("cors");
const multiparty = require("connect-multiparty");
const morgan = require("morgan");
const cloudinary = require("cloudinary");
const app = express();
const { fileURLToPath } = require('url');
const path = require('path');
const fs = require('fs');
const { dirname } = path;
const https = require('https');
const session = require('express-session');
const MongoStore = require('connect-mongo');


const corsPolicy = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsPolicy));

const io = require("socket.io")(8801, {
  pingTimeout: 6000,
  cors: {
    origin: true,
  },
});

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);


//starting https server
const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, './.cert/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, './.cert/cert.pem'))
};

dotenv.config();


// multiparty middleware
app.use(multiparty());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); // Add this line to handle non-file fields


cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.API_KEY,
  api_secret: process.env.Api_Secret,
});

databaseConnection();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api", require("./Routes/signUpRoute"));
app.use("/api", require("./Routes/LoginRoute"));
app.use("/api/user/", require("./Routes/ForgetPasswordRoute"));
app.use("/api/profile", require("./Routes/ProfileRoutes"));
app.use("/api/questions", require("./Routes/QuestionsRoute"));
// New route for the test case
app.get("/test", (req, res) => {
  res.status(200).send("hello");
});

const port = process.env.PORT || 5500;

// app.listen(PORT, () => {
//   console.log(`server started on ${PORT}`);
// });

const server = https.createServer(httpsOptions, app);
console.log('Development Server')
server.listen(port, () => {
  console.log(`Development Server is running on port ${port}`);
});

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
    // for flutter remove comments and braodCast and emit reply data instead of reply
    users.forEach((user) => {
      console.log("outside if" + user._id);
      if (userId !== user._id) {
        socket.emit("new reply", replyData); // Emits to all users except the current socket (logged-in user)
        console.log("inside if" + user._id);
      }
    });

  });
});

// Setting up the session middleware in your Express server
app.use(session({
  secret: process.env.Session_secret, 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoUrl,
    collectionName: 'User Sessions' // Optional: specify the collection name for storing sessions
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

module.exports = app;