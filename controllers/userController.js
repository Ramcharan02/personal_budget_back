const userModel = require("../models/user");
require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log("Received credentials:", { email, password });
  if (email) {
    email.toLowerCase();
  }
  userModel
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        res.status(401).json({ error: "invalid credentials" });
      } else {
        user.comparePasswords(password).then((result) => {
          console.log(result);
          if (result) {
            const userId = user._id;
            const accessToken = jwt.sign(
              { userId },
              process.env.ACCESS_TOKEN_SECRET,
              {
                expiresIn: "3m",
              }
            );

            res.json({ accessToken, user });
          } else {
            console.log("wrong password");
            res.status(401).json({ error: "Wrong password" });
          }
        });
      }
    })
    .catch((err) => res.status(500).json({ error: "Internal Server Error" }));
};

exports.createUser = (req, res) => {
  let user = new userModel(req.body);
  if (user.email) {
    user.email = user.email.toLowerCase();
  }
  user
    .save()
    .then((user) => res.json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(403).json({ error: err.message });
      }

      if (err.code === 11000) {
        return res.status(403).json({ error: "Email has been used" });
      }
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.refreshToken = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let decodedToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    decodedToken = decoded;
  });

  const newAccessToken = jwt.sign(
    { userId: decodedToken.userId },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "3m",
    }
  );

  return res.json({ newAccessToken });
};
