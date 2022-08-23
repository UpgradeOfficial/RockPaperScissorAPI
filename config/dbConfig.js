const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const DATABASE_URI = process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/rpcgame"
console.log(DATABASE_URI)
const connectDB = async () =>{
    try{
        await mongoose.connect(DATABASE_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true

        })
    }catch(err){

    }
}

module.exports = connectDB
