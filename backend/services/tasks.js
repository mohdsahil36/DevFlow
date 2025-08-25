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
