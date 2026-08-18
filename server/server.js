require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, disconnectDB, getDBState } = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const boardRoutes = require("./routes/boardRoutes.js");
const taskRoutes = require("./routes/taskRoutes.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/health", (req, res) => {
  const readyState = getDBState();

  const states = ["disconnected", "connected", "connecting", "disconnecting"];

  const healthy = readyState === 1;

  const report = {
    status: healthy ? "ok" : "degraded",
    database: states[readyState],
    uptime: Math.floor(process.uptime()),
    memoryMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
  };

  res.status(healthy ? 200 : 503).json(report);
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
let server;
let isShuttingDown = false;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal) => {
  if (isShuttingDown) {
    console.log("Shutdown already in progress...");
    return;
  }
  isShuttingDown = true;
  console.log(`${signal} received, shutting down...`);
  setTimeout(() => {
    console.error("Forced shutdown");
    process.exit(1);
  }, 10000).unref();
  try {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    console.log("HTTP server closed");
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
