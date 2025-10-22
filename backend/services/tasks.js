import TaskModel from "../models/connection_modal.js";

// Service function to get all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find();

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
    const taskId = req.params.id;
    const status = req.query.status;

    const updatedTasks = await TaskModel.findByIdAndUpdate(taskId, {
      status: status,
    });

    res.json({
      success: true,
      data: updatedTasks,
    });
  } catch (err) {
    console.error("Error in updateTasks:", err);
    res.status(500).json({
      error: "Failed to process task update",
      details: err.message,
    });
  }
};
