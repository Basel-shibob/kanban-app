const taskRepo = require('../storage/taskRepository');
const boardRepo = require('../storage/boardRepository');
const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const validStatuses = ["todo", "inprogress", "done"];

const assertBoardOwned = async (boardId, userId) => {
    if(!mongoose.isValidObjectId(boardId)) throw new AppError('Invalid board id', 400);
    const board = await boardRepo.getById(boardId);
    if(!board) throw new AppError('Board not found', 404);
    if(board.user !== userId) throw new AppError("Not authorized", 403);
    return board;
};

const assertTaskOwned = async (taskId, userId) => {
    if(!mongoose.isValidObjectId(taskId)) throw new AppError('Invalid task id', 400);
    const task = await taskRepo.getById(taskId);
    if(!task) throw new AppError('Task not found', 404);
    await assertBoardOwned(task.board, userId);
    return task;
}

const listTasks = async (boardId, userId) => {
    await assertBoardOwned(boardId, userId);
    return await taskRepo.getAllByBoard(boardId);
};

const createTask = async (boardId, userId, { title, description }) => {
    const order = await taskRepo.countByBoardAndStatus(boardId, "todo")
    await assertBoardOwned(boardId, userId);
    if(!title) throw new AppError('Title is required', 400);
    return taskRepo.create({ title, description, boardId, order });
};

const updateTask = async (taskId, userId, status) => {
    await assertTaskOwned(taskId, userId);
    if (!validStatuses.includes(status)) throw new AppError('Invalid status', 400);
    return taskRepo.update(taskId, { status });
};

const deleteTask  = async (taskId, userId) => {
    await assertTaskOwned(taskId, userId);
    return taskRepo.deleteById(taskId);
}

module.exports = {
    listTasks,
    createTask,
    updateTask,
    deleteTask
};
