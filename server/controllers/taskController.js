const taskService = require("../services/taskService.js");

const createTask = async (req, res) => {
  const { title, description, boardId } = req.body;
  const newTask = await taskService.createTask(boardId, req.user.id, {
    title,
    description,
  });
  res.status(201).json({ message: "New task created successfully", newTask });
};

const getTasks = async (req, res) => {
  const tasks = await taskService.listTasks(req.params.boardId, req.user.id);
  res.status(200).json({ tasks });
};

const updateTask = async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.user.id, req.body.status);
  res.status(200).json({ task });
};

const deleteTask = async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user.id);
  res.status(200).json({ message: "Task deleted successfully" });
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
