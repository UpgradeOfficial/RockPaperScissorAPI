const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: false,
          ref: "User",
        },
        move: string,
      },
    ],
    completed: {
        type: boolean,
        default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("RPCGame", userSchema);
