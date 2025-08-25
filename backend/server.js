import express from "express";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const port = 8080;

app.use(cors({ credentials: true }));
app.use(express.json());

// Use the task routes
app.use("/", taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
