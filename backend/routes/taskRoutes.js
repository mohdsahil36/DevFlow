import express from "express";
import {  getAllTasks,
    addNewTask,
    getTaskById,
    updateTaskStatus,
    deleteTask,
    updateTask} from '../controller/taskController.js';

const router = express.Router();
// Route to get all tasks
router.get("/kanban", getAllTasks);
//Route to fetch id specific data
router.get("/kanban/:id", getTaskById);
// Route to update task statusß
router.put("/tasks/:id/status", updateTaskStatus);
//Route to update task
router.put("/kanban/:id", updateTask);
//Route to add new task to database
router.post("/kanban", addNewTask);
//Route to delete task from database
router.delete("/kanban/:id", deleteTask);

export default router;
