const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "USER" },
    category: { type: String, required: [true, "CATEGORY required"] },
    expense: { type: Number, required: [true, "EXPENSE required"] },
    name: { type: String, required: [true, "NAME required"] },
    expensedate: { type: String, required: [true, "DATE required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("expense", expenseSchema);
