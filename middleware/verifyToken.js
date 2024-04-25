const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    
    try {
      const headerToken = req.cookies.token;
      if (!headerToken) {
        return res.status(401).json({ message: "Unauthorized access" });
     
    }
     const decode = jwt.verify(headerToken, process.env.SECRET_CODE)
     req.userId= decode.userId;
     next();
    }
    catch(error){
       console.log(error);
       res.status(401).json({errorMessage:"Invalid Token!"})
    }
}

module.exports = verifyToken;