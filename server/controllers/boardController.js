const Board = require('../models/Board.js');

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
		console.log(error);
		res.status(500).json({message: "Server error"});
	}
};

const getBoards = async (req, res) => {
	try{
		const boards = await Board.find({user: req.user.id});
		res.status(200).json({boards});
	}catch(error){
		console.log(error);
		res.status(500).json({message: "Server error"});
	}
}

const deleteBoard = async (req, res) =>{
	try{
		const board = await Board.findById(req.params.id);
		if(!board){
			res.status(404).json({message: "Board not found"});
		}else{
			if(board.user.toString() === req.user.id){
				await board.deleteOne()
				res.status(200).json({
					message: " Board deleted successfully "
				});
			}else{
				return res.status(403).json({
					message: "Not authorized"	
				});
			}
		}
	}catch(error){
		console.log(error);
		res.status(500).json({message: "Server error"});
	}
};


module.exports = { createBoard, getBoards, deleteBoard };

