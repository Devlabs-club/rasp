import express from "express"
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

import authRouter from "./routes/authRoute.js";
import { userVerification } from "./middlewares/authMiddleware.js";

// Database
mongoose.connect(process.env.ATLAS_URI)
.then(() => { console.log("Connected to MongoDB Successfully"); })
.catch((err) => { console.error(err); });

// Server
const app = express();
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

app.post('/', userVerification);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
});