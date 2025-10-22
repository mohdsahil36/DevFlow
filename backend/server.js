import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import connectionToDb from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// Use the task routes
app.use("/", taskRoutes);

connectionToDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
  });
