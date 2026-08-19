const mongoose = require("mongoose");
const taskRepo = require("../storage/taskRepository.js");
const boardRepo = require("../storage/boardRepository.js");

const createBoard = async (req, res) => {
  const title = req.body.title?.trim();
  if (!title) {
    return res.status(400).json({ message: "Title is required!" });
  }

  const newBoard = await boardRepo.create({
    title: title,
    userId: req.user.id,
  });
  res.status(201).json({ message: "New board created successfully", board: newBoard });
};

const getBoards = async (req, res) => {
  const boards = await boardRepo.getAllByUser(req.user.id);
  res.status(200).json({ boards });
};

const deleteBoard = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid board id" });
  }
  const board = await boardRepo.getById(id);
  if (!board) {
    return res.status(404).json({ message: "Board not found" });
  }
  if (board.user === req.user.id) {
    const deletedCount = await taskRepo.removeAllByBoard(board.id);
    await boardRepo.deleteById(board.id);
    res.status(200).json({
      message: " Board deleted successfully ",
      deletedTasks: deletedCount,
    });
  } else {
    return res.status(403).json({
      message: "Not authorized",
    });
  }
};

module.exports = { createBoard, getBoards, deleteBoard };
