const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const boardRoutes = require('./routes/boardRoutes.js');
const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes)
app.use('/api/boards', boardRoutes)

app.get('/api/health', (req, res) =>{
	res.json({ status: 'Server is alive', timestamp: new Date() });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`server running on port:${PORT}`);
});
