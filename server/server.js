import express from "express"
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setConnectedClient, removeConnectedClient } from './utils/connectedClients.js';
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

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.CLIENT_URL]
    : ['http://localhost:3000', 'https://rasp-nu.vercel.app'],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));

app.post('/', userVerification);
app.use("/auth", authRouter);
app.use("/user", aboutRouter);
app.use("/chat", chatRouter);

// Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  const { userId } = socket.handshake.query;
  
  setConnectedClient(userId, socket);

  console.log(`User ${userId} connected.`);

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected.`);
    removeConnectedClient(userId);
  });
});

// Server Listener
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});