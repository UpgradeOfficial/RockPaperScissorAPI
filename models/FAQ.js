const mongoose = require("mongoose");


const FAQSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: [true, "Please enter a description"],
  },
},{timestamps: true});

module.exports = mongoose.model("FAQ", FAQSchema);