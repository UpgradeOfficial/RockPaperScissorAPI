const mongoose = require("mongoose");
const { isEmail } = require("validator");

const imageSchema = mongoose.Schema({
  secure_url: {
    type: String,
    required: false,
    default: "",
  },
  public_id: {
    type: String,
    required: true,
    default: "",
  },
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Minimun password length is 8"],
  },
  image: imageSchema,
  roles: {
    type: [String],
    default: ["Gamer"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
},{timestamps: true});

module.exports = mongoose.model("User", userSchema);
