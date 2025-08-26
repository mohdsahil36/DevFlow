import express from "express";
import { getAllTasks, updateTasks } from "../services/tasks.js";

const router = express.Router();

// Route to get all tasks
router.get("/kanban", getAllTasks);

// Route to update task status - matches frontend call
router.put("/tasks/:id/status", updateTasks);

export default router;
