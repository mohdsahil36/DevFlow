import express from "express";
import {
  getAllTasks,
  updateTasks,
  addNewTask,
  deleteTask,
  getTaskById,
} from "../services/tasks.js";

const router = express.Router();

// Route to get all tasks
router.get("/kanban", getAllTasks);
//Route to fetch id specific data
router.get("/kanban/:id", getTaskById);
// Route to update task status
router.put("/tasks/:id/status", updateTasks);
//Route to add new task to database
router.post("/kanban", addNewTask);
//Route to delete task from database
router.delete("/kanban/:id", deleteTask);

export default router;
