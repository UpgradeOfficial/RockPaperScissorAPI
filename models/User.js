const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    username: {
        type: String,
        required: true,
        minlength: 8
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }
},{timestamps: true})

const User = mongoose.model('User', userSchema)

module.exports = User