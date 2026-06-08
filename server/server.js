import express from "express";
import "dotenv/config";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

// Setup server
const app = express();
const server = http.createServer(app);

// Socket.io setup
export const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.CLIENT_URL
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Store online users
export const userSocketMap = {}; // { userId: socketId }

// Socket connection handler
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
  origin: [
    "http://localhost:5173"
  ],
  credentials: true
}));

// Routes
app.get("/api/status", (req, res) => {
  res.send("Server is Live");
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect Database
await connectDB();

// Start server (Local Development)
if (process.env.NODE_ENV !== "production") {

  const PORT = process.env.PORT || 5000;

  server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
  });

}

// Export for Vercel
export default server;
