import express from "express";
import {
  getAllTasks,
  updateTasksStatus,
  addNewTask,
  deleteTask,
  getTaskById,
  updatedTasks,
} from "../services/tasks.js";

const router = express.Router();

// Route to get all tasks
router.get("/kanban", getAllTasks);
//Route to fetch id specific data
router.get("/kanban/:id", getTaskById);
// Route to update task status
router.put("/tasks/:id/status", updateTasksStatus);
//Route to update task
router.put("/kanban/:id", updatedTasks);
//Route to add new task to database
router.post("/kanban", addNewTask);
//Route to delete task from database
router.delete("/kanban/:id", deleteTask);

export default router;
