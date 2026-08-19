const taskService = require("../services/taskService.js");

const createTask = async (req, res) => {
  const { description, boardId } = req.body;
  const title = req.body.title?.trim();
  if (!title) {
    return res.status(400).json({ message: "Title is required!" });
  }
  const newTask = await taskService.createTask(boardId, req.user.id, {
    title,
    description,
  });
  res
    .status(201)
    .json({ message: "New task created successfully", task: newTask });
};

const getTasks = async (req, res) => {
  const tasks = await taskService.listTasks(req.params.boardId, req.user.id);
  res.status(200).json({ tasks });
};

const updateTask = async (req, res) => {
  const task = await taskService.updateTask(
    req.params.id,
    req.user.id,
    req.body.status,
  );
  res.status(200).json({ task });
};

const deleteTask = async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user.id);
  res.status(200).json({ message: "Task deleted successfully" });
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
