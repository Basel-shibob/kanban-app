const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
	title: {type: String, required: true },
	description: { type: String, required: false },
	status: { 
		type: String,
		required: true,
		enum: ['todo', 'inprogress', 'done'],
		default: 'todo',
		},
	board: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Board',
		required: true
		}

}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
