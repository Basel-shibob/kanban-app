const Task = require("../models/Task");

const toTask = (doc) => {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    status: doc.status,
    board: doc.board.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

const getAllByBoard = async (boardId) => {
  const docs = await Task.find({ board: boardId });
  return docs.map(toTask);
};

const getById = async (id) => {
  const doc = await Task.findById(id);
  if (!doc) {
    return null;
  }
  return toTask(doc);
};

const create = async ({ title, description, boardId }) => {
  const newTask = new Task({
    title,
    description,
    board: boardId,
  });
  await newTask.save();
  return toTask(newTask);
};

const update = async (id, updateData) => {
  const doc = await Task.findByIdAndUpdate(id, updateData, { new: true });
  if (!doc) {
    return null;
  }
  return toTask(doc);
};

const deleteById = async (id) => {
  const doc = await Task.findByIdAndDelete(id);
  if (!doc) {
    return null;
  }
  return toTask(doc);
};
const removeAllByBoard = async (boardId) => {
  const { deletedCount } = await Task.deleteMany({ board: boardId });
  return deletedCount;
}

module.exports = {
  getAllByBoard,
  getById,
  create,
  update,
  deleteById,
  removeAllByBoard,
};
