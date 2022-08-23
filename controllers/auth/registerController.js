const User = require("../../models/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  console.log(req.body)
  const { email, password, username } = req.body;
  if (!email || !password || !username)
    return res
      .status(404)
      .json({ message: "email, password and username are required" });

  const duplicate = await User.findOne({ email }).exec();

  if (duplicate)
    return res.status(409).json({ message: "email already exists" });
  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password, username });

    res.status(201).json({ message: "success user created", user });
  } catch (err) {
    res.json({ message: "something went wrong contact addmin" + err.message });
  }
};

module.exports = {
  handleNewUser,
};