const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    category: { type: String },
    budget: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("budget", budgetSchema);
