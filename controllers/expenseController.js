require("dotenv").config();
const jwt = require("jsonwebtoken");
const expenseModel = require("../models/expense");

exports.getExpenses = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Error!Token was not provided." });
  }
  
  let decodedToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    decodedToken = decoded;
  });
  expenseModel
    .find({ user: decodedToken.userId })
    .then((expenses) => {
      return res.status(200).json({ success: true, expenses });
    })
    .catch((err) => {
      return res.status(403).json({ err });
    });
};

exports.addExpense = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Error!Token was not provided." });
  }
  
  let decodedToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    decodedToken = decoded;
  });

  let expense = req.body;
  expense.user = decodedToken.userId;
  let expenseObj = new expenseModel(expense);
  expenseObj
    .save()
    .then((expenseData) => {
      return res.status(200).json({
        success: true,
        data: { expenseData },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(403).json({ error: err.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getExpense = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Error!Token was not provided." });
  }
 
  let decodedToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    decodedToken = decoded;
  });
  let id = req.params.id;

  expenseModel
    .findById(id)
    .then((expense) => {
      return res.status(200).json({ success: true, expense });
    })
    .catch((err) => {
      return res.status(403).json({ err });
    });
};

exports.updateExpense = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Error!Token was not provided." });
  }

  let decodedToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    decodedToken = decoded;
  });

  let expenseData = req.body;
  let id = req.params.id;

  expenseModel
    .findByIdAndUpdate(id, expenseData, { useFindAndModify: false })
    .then((expense) => {
      if (expense) {
        return res.status(200).json({
          success: true,
          data: { expense },
        });
      } else {
        return res
          .status(404)
          .json({ msg: `Cannot find expense with ID: ${id}` });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(403).json({ error: err.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.deleteExpense = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "Error!Token was not provided." });
  }
  let decodedToken;
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: err });
    }
    decodedToken = decoded;
  });

  let id = req.params.id;

  expenseModel
    .findByIdAndDelete(id)
    .then((expense) => {
      if (expense) {
        return res.status(200).json({
          success: true,
          data: { expense },
        });
      } else {
        return res
          .status(404)
          .json({ msg: `Cannot find expense with ID: ${id}` });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(403).json({ error: err.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    });
};
