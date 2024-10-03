import express from "express"
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectedClients from "./utils/connectedClients.js";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/authRoute.js";
import aboutRouter from "./routes/userRoute.js";
import chatRouter from "./routes/chatRoute.js";
import { userVerification } from "./middlewares/authMiddleware.js";

// Database
mongoose.connect(process.env.ATLAS_URI)
.then(() => { console.log("Connected to MongoDB Successfully"); })
.catch((err) => { console.error(err); });

// Server
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your React app's URL
        methods: ['GET', 'POST'],
    },
});

app.use(cors(
  {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }
));
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));

app.post('/', userVerification);
app.use("/auth", authRouter);
app.use("/user", aboutRouter);
app.use("/chat", chatRouter);

io.on('connection', (socket) => {
  const { userId } = socket.handshake.query;
  
  connectedClients[userId] = socket;

  console.log(`User ${userId} connected.`);

  socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected.`);
      delete connectedClients[userId];
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});