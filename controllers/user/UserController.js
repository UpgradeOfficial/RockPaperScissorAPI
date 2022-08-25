const User = require("../../models/User");
const bcrypt = require("bcrypt");

const handleGetUser = async (req, res) => {
  const user = req.user;
  res.json(user);
};

module.exports = {
  handleGetUser,
};
