const jwt = require("jsonwebtoken");



const verifyJWT = (req, res, next) =>{
    // cause it can come in lower or upper case letter the authorization
    //  This is a good check in the server

    const authHeader = req.headers.authorization || req.headers.Authorization;
    // the auth header must start with bearer
    if(!authHeader?.startsWith("Bearer ")) return res.sendStatus(403)
    console.log(authHeader); // Bearer token
    const token = authHeader.split(" ")[1]
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) =>{
            if(err) return res.sendStatus(403)// forbidden Invalid token
            req.user = decoded.userInfo;
            next()
        }
    )
}

module.exports = verifyJWT