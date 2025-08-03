require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const parcelRoutes = require("./routes/parcelRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/parcels", parcelRoutes);
app.use("/api/users", userRoutes);

io.on("connection", (socket) => {
  socket.on("joinParcelRoom", (parcelId) => {
    socket.join(parcelId);

    setInterval(() => {
      const location = {
        lat: Math.random() * 90,
        lng: Math.random() * 180
      };
      io.to(parcelId).emit("locationUpdate", location);
    }, 5000);
  });

  socket.on("disconnect", () => {
 
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
