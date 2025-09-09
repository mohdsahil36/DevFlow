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

export const getTaskById = async (req, res) => {
  const taskId = req.params.id;
  try {
    const taskData = await TaskModel.findById(taskId);

    res.json({
      success: true,
      message: "Specific data is fetched!",
      data: taskData,
    });
  } catch (err) {
    console.error("Error fetching the specific task data:", err);
    res.status(500).json({
      error: "Failed to fetch task specific data",
      error: err.message,
    });
  }
};

export const updateTasksStatus = async (req, res) => {
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

export const deleteTask = async (req, res) => {
  try {
    const taskID = req.params.id;

    const updatedTasks = await TaskModel.deleteOne({ _id: taskID });
    res.json({
      success: true,
      message: "Task deleted successfully",
      data: updatedTasks,
    });
  } catch (error) {
    console.error("Error while deleting task:", error);
    res.status(500).json({
      error: "Failed to process task update",
      details: error.message,
    });
  }
};

export const updatedTasks = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updateData = req.body;

    // Remove id from the incoming data and store the rest of the data in dataToUpdate
    const { _id, ...dataToUpdate } = updateData;

    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      dataToUpdate,
      { new: true }
    );
    res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (err) {
    console.error("Error while updating task:", err);
    res.status(500).json({
      error: "Failed to process task update",
      details: err.message,
    });
  }
};
