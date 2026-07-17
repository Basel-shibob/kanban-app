const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController.js');

const router = express.Router();

router.post('/', protect, createTask);
router.get('/:boardId', protect, getTasks);
router.patch('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
