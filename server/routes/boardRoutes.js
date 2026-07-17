const express = require('express');
const { protect } = require('../middleware/authMiddleware.js');
const { createBoard,getBoards,deleteBoard } = require('../controllers/boardController');

const router = express.Router();

router.post('/', protect, createBoard);
router.get('/', protect, getBoards);
router.delete('/:id', protect, deleteBoard);

module.exports = router;
