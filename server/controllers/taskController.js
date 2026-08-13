const Board = require('../models/Board.js');
const Task = require('../models/Task.js');
const mongoose = require('mongoose');

const createTask = async (req, res) =>{
	const { title, description, boardId } = req.body;
	if(!title || !boardId){
		return res.status(400).json({ 
			message: "Bad request"
		})
	}
	
	try{
		if(!mongoose.isValidObjectId(boardId)){
			return res.status(400).json({message: "Invalid board id"});
		}
		const board = await Board.findById(boardId);
		if(!board){
			return res.status(404).json({
				message: "Board not found"
			})
		}
		if(board.user.toString() !== req.user.id){
			return res.status(403).json({
				message: "Not authorized"
			})
		}
		const newTask = new Task({
			title,
			description,
			board: boardId
		})

		await newTask.save()
		
		res.status(201).json({
			message: 'New task created successfully',
			newTask
		})

	}catch(error){
		console.error("Error creating task:", error);
		res.status(500).json({
			message: "Server error"
		})
	}
}

const getTasks = async (req, res) =>{
	const boardId = req.params.boardId;
	if(!mongoose.isValidObjectId(boardId)){
		return res.status(400).json({message: "Invalid board id"});
	}
	try{
		const board = await Board.findById(boardId)
		if(!board){
			return res.status(404).json({
				message: "Board Not Found"
			});
		}
		if(board.user.toString() !== req.user.id){
			return res.status(403).json({
				message: "Not authorized"
			});
		}
		const tasks = await Task.find({ board: boardId });
		return res.status(200).json({
			tasks
		});
	}catch(error){
		console.error("Error fetching tasks:", error);
		res.status(500).json({
			message: "Server error"
		});
	}

}

const updateTask = async (req, res) =>{
	const taskId = req.params.id;
	if(!mongoose.isValidObjectId(taskId)){
		return res.status(400).json({message: "Invalid task id"});
	}
	const { status } = req.body;
	
	const validStatuses = [
		"todo",
  		"inprogress",
  		"done"
	];
	try{
		const task = await Task.findById(taskId);
		if(!task){
			return res.status(404).json({
				message: "Task Not Found"
			})
		}
		const board = await Board.findById(task.board);
		if(!board){
			return res.status(404).json({
				message: "Board Not Found"
			});
		}
		if(board.user.toString() !== req.user.id){
			return res.status(403).json({
				message: "Not authorized"
			});
		}
		if(!validStatuses.includes(status)){
			return res.status(400).json({
				message: "Invalid Status"
			});
		}
		task.status = status;
		await task.save();
		res.status(200).json({
			task
		});

	}catch(error){
		console.error("Error updating task:", error);
		res.status(500).json({
			message: "Server error"
		})
	}
}

const deleteTask = async (req, res)=>{
	const taskId = req.params.id;
	if(!mongoose.isValidObjectId(taskId)){
		return res.status(400).json({message: "Invalid task id"});
	}
	try{
		const task = await Task.findById(taskId);
		if(!task){
			return res.status(404).json({
				message: "Task Not Found"
			});
		}
		const board = await Board.findById(task.board);
		if(!board){
			return res.status(404).json({
				message: "Board Not Found"
			});
		}
		if(board.user.toString() !== req.user.id){
			return res.status(403).json({
				message: "Not authorized"
			});
		}
		await task.deleteOne()
		return res.status(200).json({
			message: "Task Deleted Successfully!"
		});
	}catch(error){
		console.error("Error deleting task:", error);
		res.status(500).json({
			message: "Server error"
		});
	}
}

module.exports = { createTask, getTasks, updateTask, deleteTask };
