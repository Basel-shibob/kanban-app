const User = require("../models/User");

const toUser = (doc) => {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

const getById = async (id) => {
  const doc = await User.findById(id);
  if (!doc) {
    return null;
  }
  return toUser(doc);
};

const getByEmail = async (email) => {
  const doc = await User.findOne({ email });
  if (!doc) {
    return null;
  }
  return toUser(doc);
};

const getByEmailWithPassword = async (email) => {
  const doc = await User.findOne({ email });
  if (!doc) {
    return null;
  }
  return { ...toUser(doc), password: doc.password };
};

const create = async ({ name, email, password }) => {
  const newUser = new User({
    name,
    email,
    password,
  });
  await newUser.save();
  return toUser(newUser);
};

module.exports = {
  getById,
  getByEmail,
  getByEmailWithPassword,
  create,
};
