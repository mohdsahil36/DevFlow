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

export const addNewTask = async (req, res) => {
  try {
    const newTaskData = req.body;

    let dueDateObj;
    if (newTaskData.dueDate) {
      dueDateObj =
        typeof newTaskData.dueDate === "string"
          ? new Date(newTaskData.dueDate).toISOString().split("T")[0]
          : newTaskData.dueDate;
    }

    const taskToSave = {
      title: newTaskData.title,
      description: newTaskData.description,
      priority:
        newTaskData.priority.charAt(0).toUpperCase() +
        newTaskData.priority.slice(1),
      due_date: dueDateObj,
      status: newTaskData.status,
    };

    const newlyAdded = await TaskModel.create(taskToSave);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      receivedData: newlyAdded,
    });
  } catch (error) {
    console.error("Error while adding new task:", error);
    res.status(500).json({
      success: false,
      error: "Error processing request",
      details: error.message,
    });
  }
};
