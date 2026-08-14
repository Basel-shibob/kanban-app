const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ message: messages.join(", ") });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate field value entered" });
  }
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
