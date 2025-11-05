require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const http = require("http");

const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet()); // Security Headers
app.use(morgan("short"));
// Rate Limit for brute force attacks
app.use(
  rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100,
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const clientDir = path.join(__dirname, "public");
app.use(express.static(clientDir));

app.get("*", (req, res) => {
  res.sendFile(path.join(clientDir, "index.html"));
});

const server = http.createServer(app);

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  server.close(() => process.exit(1));
});

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log("Server is started on port " + port);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});
process.on("rejectionHandled", (error) => {
  console.error("Rejection handled:", error);
});
module.exports = app;
