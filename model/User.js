const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    roles: {
      User: {
        type: Number,
        default: 1111,
      },
      Editor: Number,
      Admin: Number,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: [String],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("User", userSchema);
