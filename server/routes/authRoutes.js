const express = require('express');
const router = express.Router();
const { loginLimiter } = require('../middleware/rateLimiter.js');

const {protect} = require('../middleware/authMiddleware.js');
const { registerUser, loginUser, verifyToken } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginLimiter, loginUser);
router.get('/verify', protect, verifyToken);

module.exports = router;
