const Board = require('../models/Board.js');
const mongoose = require('mongoose');
const Task = require('../models/Task.js');

const createBoard = async (req, res) => {
	const { title } = req.body;
	if(!title){
		return res.status(400).json({ message: "Title is required!" })
	};
	try{
		const newBoard = new Board({
			title: title,
			user: req.user.id		
		});
		await newBoard.save();
		res.status(200).json(newBoard);
	}catch(error){
		console.error("Error creating board:", error);
		res.status(500).json({message: "Server error"});
	}
};

const getBoards = async (req, res) => {
	try{
		const boards = await Board.find({user: req.user.id});
		res.status(200).json({boards});
	}catch(error){
		console.error("Error fetching boards:", error);
		res.status(500).json({message: "Server error"});
	}
}

const deleteBoard = async (req, res) =>{
	try{
		const id = req.params.id;
		if(!mongoose.isValidObjectId(id)){
			return res.status(400).json({message: "Invalid board id"});
		}
		const board = await Board.findById(id);
		if(!board){
			return res.status(404).json({message: "Board not found"});
		}else{
			if(board.user.toString() === req.user.id){
				const { deletedCount } = await Task.deleteMany({board: board._id});
				await board.deleteOne()
				res.status(200).json({
					message: " Board deleted successfully ",
					deletedTasks: deletedCount
				});
			}else{
				return res.status(403).json({
					message: "Not authorized"	
				});
			}
		}
	}catch(error){
		console.error("Error deleting board:", error);
		res.status(500).json({message: "Server error"});
	}
};


module.exports = { createBoard, getBoards, deleteBoard };

