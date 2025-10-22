import Task from "../models/connection_modal.js";

export const getAllTasks = async () => {
  return await Task.find();
};

export const getTaskById = async (taskId) => {
  return await Task.findById(taskId);
};

export const addNewTask = async (data) => {
  return await Task.create(data);
};

export const deleteTask = async (taskId) => {
  return await Task.deleteOne({ _id: taskId });
};

export const updateTask = async (taskId, data) => {
  return await Task.findByIdAndUpdate(taskId, data, { new: true });
};

export const updateTaskStatus = async (taskId, status) => {
  return await Task.findByIdAndUpdate(taskId, { status }, { new: true });
};