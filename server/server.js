import express from "express";
import "dotenv/config";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();
const server = http.createServer(app);

// Socket.io
export const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true
  }
});

// Online Users
export const userSocketMap = {};

// Socket Connection
io.on("connection", (socket) => {

  const userId = socket.handshake.query.userId;

  console.log("User Connected:", userId);

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {

    console.log("User Disconnected:", userId);

    delete userSocketMap[userId];

    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));

app.use(cors({
  origin: true,
  credentials: true
}));

// Debug
console.log("CLIENT_URL =", process.env.CLIENT_URL);

// Routes
app.get("/api/status", (req, res) => {
  res.send("Server is Live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Database
await connectDB();

// Local Development Only
if (process.env.NODE_ENV !== "production") {

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  });

}

export default server;
