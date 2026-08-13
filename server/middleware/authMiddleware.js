const jwt = require('jsonwebtoken');

const protect = (req,res,next) =>{
	const Authorization = req.headers.authorization;
	if(Authorization && Authorization.startsWith('Bearer ')){
		const reqToken = Authorization.split(' ')[1];
		try {
			const verifyToken = jwt.verify(reqToken, process.env.JWT_SECRET);
			if(verifyToken){
				req.user = verifyToken;
				next();
			}
		}catch(error){
			console.log(error);
			return res.status(401).json({ message: 'Invalid or expired token' });
		}
	}else{
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

module.exports = { protect };
