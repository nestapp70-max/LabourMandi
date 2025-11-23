import { Server } from "socket.io";
import jwt from "jsonwebtoken";

export const setupChatSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL, credentials: true }
  });

  io.on("connection", (socket) => {
    socket.on("join", (room: string) => socket.join(room));

    socket.on("message", (data) => {
      io.to(data.room).emit("message", data);
    });
  });

  console.log("Socket.io Live");
};
