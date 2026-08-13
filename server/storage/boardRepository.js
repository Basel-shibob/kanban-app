const Board = require("../models/Board.js");

const toBoard = (doc) => {
  return {
    id: doc._id.toString(),
    title: doc.title,
    user: doc.user.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

const getAllByUser = async (userId) => {
  const docs = await Board.find({ user: userId });
  return docs.map(toBoard);
};

const getById = async (id) => {
  const doc = await Board.findById(id);
  if (!doc) {
    return null;
  }
  return toBoard(doc);
};

const create = async ({ title, userId }) => {
  const newBoard = new Board({
    title,
    user: userId,
  });
  await newBoard.save();
  return toBoard(newBoard);
};

const deleteById = async (id) => {
  const doc = await Board.findByIdAndDelete(id);
  if (!doc) {
    return null;
  }
  return toBoard(doc);
};

module.exports = {
  getAllByUser,
  getById,
  create,
  deleteById,
}; 