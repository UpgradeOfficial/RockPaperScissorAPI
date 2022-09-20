const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");

// @desc Create new user
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { email, password, roles } = req.body;
  const data = req.file;

  //console.log(req)

  // Confirm data
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate email
  const duplicate = await User.findOne({ email })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate email" });
  }

  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  let userObject =
    !Array.isArray(roles) || !roles.length
      ? { email, password: hashedPwd }
      : { email, password: hashedPwd, roles };
  if (data) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path
    );
    userObject.image = {
      secure_url,
      public_id,
    };
  }
  // Create and store new user
  const user = await User.create(userObject);

  if (user) {
    //created
    res.status(201).json({ data: user, message: `New user ${email} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser || !foundUser.active) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(401).json({ message: "Unauthorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
        roles: foundUser.roles,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    { email: foundUser.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_EXPIRATION }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: true, //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username and roles
  res.json({ accessToken, refreshToken });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
  const { refreshToken } = req.body;
  // const cookies = req.cookies

  //if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

  //const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({ email: decoded.email }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_EXPIRATION } //'15m'
      );

      const refreshToken = jwt.sign(
        { email: foundUser.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_EXPIRATION } // '7d'
      );

      res.json({ accessToken, refreshToken });
    }
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

const verifyUserEmail = async (req, res) => {
  const {token} =req.params
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Forbidden, invalid token" });

      const foundUser = await User.findOne({ email: decoded.email }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      foundUser.isVerified = true;
      await foundUser.save();

      res.status(200).json({ message: "User Verification Successfull" });
    }
  );
};

module.exports = {
  login,
  refresh,
  logout,
  createNewUser,
  verifyUserEmail
};

