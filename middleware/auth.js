const jwt = require("jsonwebtoken");
var jwtSecret = "mysecrettoken";
module.exports = function(req,res,next){
    //Get the token from header
    const token = req.header("x-auth-token");
    //if no token in header
    if(!token){
        return res.status(401).json({msg:"No token, autherization denied"});
    }
    //verify the token
    try{
        const decoded = jwt.verify(token,jwtSecret);
        req.user = decoded.user;
        next();
    }catch(err){
        res.status(401).json({msg:"Token invalid"});
    }
}

