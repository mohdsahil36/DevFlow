import TaskModel from "../models/connection_modal.js";

// Service function to get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    console.log(`Successfully fetched ${tasks.length} tasks from database`);

    res.json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({
      error: "Failed to fetch tasks",
      details: err.message,
    });
  }
};

export const updateTasks = async (req, res) => {
  try {
    // For now, just return success without actually updating the database
    console.log("Received request - Task ID:", req.params.id);
    console.log("Received request - Status:", req.body.status);
    res.json({
      success: true,
      message: "Task status update logged successfully",
      taskId: req.params.id,
      newStatus: req.body.status,
    });
  } catch (err) {
    console.error("Error in updateTasks:", err);
    res.status(500).json({
      error: "Failed to process task update",
      details: err.message,
    });
  }
};
