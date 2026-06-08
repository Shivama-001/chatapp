import express from "express";
import "dotenv/config";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";

import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

////setup server
const app = express();
const server = http.createServer(app);

// Socket.io setup

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
// export const io = new Server(server,{
//   cors:{
//   origin: process.env.CLIENT_URL,
//   credentials:true
// }
// })

// Store online user data
export const userSocketMap = {}; // { userId: socketId }

// Socket connection handler
io.on("connection", (socket) => {

  const userId = socket.handshake.query.userId;

  console.log("User Connected:", userId);

  // Store user socket id
  if (userId) {
    userSocketMap[userId] = socket.id;   //  FIXED
  }

  // Send online users list to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle disconnect
  socket.on("disconnect", () => {

    console.log("User Disconnected:", userId);

    delete userSocketMap[userId];
    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware
app.use(express.json({ limit: "4mb" }));

// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true
// }))
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://chatapp-82sr.vercel.app"
//   ],
//   credentials: true
// }))
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes setup
app.use("/api/status", (req, res) => res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect Database
await connectDB();

// Start server

if(process.env.NODE_ENV !== "production"){
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

}
//export for versal
export default server;
// const PORT = process.env.PORT || 5000;

// server.listen(PORT, () => {
//   console.log(`Server is running on PORT: ${PORT}`);
// });
