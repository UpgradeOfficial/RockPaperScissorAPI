// this is used to encrypt the password
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User")

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(404)
      .json({ message: "email, password and username are required" });

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.status(401).json({message:"Email or Password Incorrect!!!"}) 

  console.log(foundUser)
  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) return res.status(401).json({message: "Email or Password incorrect!!!P"})
  const accessToken = jwt.sign(
    {
      "userInfo":{
        "email": foundUser.email,
        'id': foundUser.id
      }
      
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn:  process.env.ACCESS_TOKEN_EXPIRATION}
  );
  // No need to send the roles in the refresh token 
  const refreshToken = jwt.sign(
    {
      email: foundUser.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  
  return res.json({ accessToken , refreshToken});
};

module.exports = {
  handleLogin,
};
