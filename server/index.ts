import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./auth.controller.js";
import paymentRoutes from "./payments.controller.js";
import { setupChatSocket } from "./chat.socket.js";

dotenv.config();
const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);

// Serve static frontend (vite build output later)
app.use(express.static("dist"));

// DB connect
mongoose.connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("DB Error", err));

// Socket.io Setup
setupChatSocket(server);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server running on " + PORT));
