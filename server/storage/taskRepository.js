const Task = require("../models/Task");

const toTask = (doc) => {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    order: doc.order,
    status: doc.status,
    board: doc.board.toString(),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

const getAllByBoard = async (boardId) => {
  const docs = await Task.find({ board: boardId }).sort({
    order: 1,
    createdAt: 1,
  });
  return docs.map(toTask);
};

const getById = async (id) => {
  const doc = await Task.findById(id);
  if (!doc) {
    return null;
  }
  return toTask(doc);
};

const create = async ({ title, description, boardId, order }) => {
  const newTask = new Task({
    title,
    description,
    board: boardId,
    order
  });
  await newTask.save();
  return toTask(newTask);
};

const update = async (id, updateData) => {
  const doc = await Task.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
  });
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
};

const countByBoardAndStatus = async (boardId, status) => {
  return await Task.countDocuments({ board: boardId, status })
}
const setOrder = async (taskIds, status) =>{
  if(taskIds.length === 0) return 0;
  const ops = taskIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: {status, order: index},
    }
  }));
  const result = await Task.bulkWrite(ops);
  return result.modifiedCount;
}

module.exports = {
  getAllByBoard,
  getById,
  create,
  update,
  deleteById,
  removeAllByBoard,
  countByBoardAndStatus,
  setOrder
};
