const User = require('../models/User.js');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config()

async function registerUser(req,res){
	const { name, email, password } = req.body;
	if(!name || !email || !password){
		return res.status(400).json({ message: "Please send valid data !" })
	}

	try{
		const checkEmail = await User.findOne({ email });
		if(checkEmail){
			return res.status(400).json({'message': 'ALREADY_EXISTS'})
		} 
		const newUser = new User({
			name,
			email,
			password
		})
		
		await newUser.save();

		res.status(201).json(
			{
				message: 'New user created',
				"Name": name,
				"email": email
			}
		)

	}catch(error){
		console.log(error);
	}
}

async function loginUser(req,res){
	const { email, password } = req.body;
	if(!email || !password){
		return res.status(400).json({ message: "Please send valid data !" });
	}

	try{
		const user = await User.findOne({ email })
		if(user){
			const stordHash = user.password;
			const verifyPassword = await bcrypt.compare(password, stordHash);
			if(!verifyPassword){
				res.status(401).json({"message": "Invalid credentials" });
			} else{
				const userToken = jwt.sign({ id: user._id },process.env.JWT_SECRET,{expiresIn: '7d'});
				res.status(200).json({"user token": userToken});
			} 
		}else{
			res.status(401).json({'message': 'Invalid credentials'});
		}
	}catch(error){
		console.log(error)
	}
}

module.exports = { registerUser, loginUser };
