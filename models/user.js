const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: { type: String, required: [true, "USERNAME required"] },
  email: {
    type: String,
    required: [true, "EMAIL_ID required"],
    unique: [true, "This EMAIL-ID has been used"],
  },
  password: { type: String, required: [true, "PASSWORD required"] },
});

userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) return next();
  bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((err) => next(err));
});

userSchema.methods.comparePasswords = function (inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};

module.exports = mongoose.model("User", userSchema);
