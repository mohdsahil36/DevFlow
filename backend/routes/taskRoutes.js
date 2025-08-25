import express from "express";
import { getAllTasks } from "../services/tasks.js";

const router = express.Router();

// Route to get all tasks
router.get("/kanban", getAllTasks);

export default router;
