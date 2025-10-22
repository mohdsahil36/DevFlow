import * as taskService from "../services/taskService.js";

// controller to fetch all tasks
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    return res.json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch tasks",
      details: err.message,
    });
  }
};

//controller to add a new task
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

    const newlyAdded = await taskService.addNewTask(taskToSave);

    if (!newlyAdded) {
      return res.status(500).json({
        error: "There was some issue adding the task!",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      receivedData: newlyAdded,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Error processing request",
      details: err.message,
    });
  }
};

//controller to fetch id specific task
export const getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await taskService.getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json({ success: true, data: task });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch task specific data",
      details: err.message,
    });
  }
};

//controller to update the status of the task after dragging
export const updateTaskStatus = async (req, res) => {
  try {
    const taskId = req.params.id;
    const status = req.query.status; // TODO: move to body later
    const updatedTask = await taskService.updateTask(taskId, { status });
    if (!updatedTask) {
      return res.status(500).json({
        error: "There was some issue while updating the task status!",
      });
    }
    return res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to process task update",
      details: err.message,
    });
  }
};

//controller to delete task
export const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const result = await taskService.deleteTask(taskId);
    if (!result || result.deletedCount === 0) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json({
      success: true,
      message: "Task deleted successfully",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to process task update",
      details: err.message,
    });
  }
};

//controller to update the data of the task
export const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const updateData = req.body;

    const { _id, ...dataToUpdate } = updateData;

    const updatedTask = await taskService.updateTask(taskId, dataToUpdate, {
      new: true,
    });

    if (!updatedTask) {
      return res.status(500).json({
        error: "There was some issue updating the task data!",
      });
    }

    return res.json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Failed to process task update",
      details: err.message,
    });
  }
};
