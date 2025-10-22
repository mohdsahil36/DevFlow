import express from "express";
import cors from "cors";
import TaskModal from "./models/connection_modal.js";

const app = express();
const port = 8080;

app.use(cors({credentials:true}));
app.use(express.json());


// Endpoint to fetch all tasks
app.get("/", async (req, res) => {
  try {    
    const tasks = await TaskModal.find();
    console.log(`Successfully fetched ${tasks.length} tasks from database`);
    
    res.json({ 
      success: true,
      count: tasks.length,
      data: tasks 
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ 
      error: "Failed to fetch tasks",
      details: err.message 
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
