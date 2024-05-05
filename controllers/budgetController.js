require("dotenv").config();
const jwt = require("jsonwebtoken");
const budgetModel = require("../models/budget");

exports.getBudgets = (req, res) => {
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
  budgetModel
    .find({ user: decodedToken.userId })
    .then((budgets) => {
      return res.status(200).json({ success: true, budgets });
    })
    .catch((err) => {
      return res.status(403).json({ err });
    });
};

exports.addBudget = (req, res) => {
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

  let budget = req.body;
  budget.user = decodedToken.userId;
  let budgetObj = new budgetModel(budget);
  budgetObj
    .save()
    .then((budgetData) => {
      return res.status(200).json({
        success: true,
        data: { budgetData },
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(403).json({ error: err.message });
      }
      res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.updateBudget = (req, res) => {
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

  let budgetData = req.body;
  let id = req.params.id;

  budgetModel
    .findByIdAndUpdate(id, budgetData, { useFindAndModify: false })
    .then((budget) => {
      if (budget) {
        return res.status(200).json({
          success: true,
          data: { budget },
        });
      } else {
        return res
          .status(404)
          .json({ msg: `Cannot find budget with ID: ${id}` });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(403).json({ error: err.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    });
};

exports.getBudget = (req, res) => {
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

  budgetModel
    .findById(id)
    .then((budget) => {
      return res.status(200).json({ success: true, budget });
    })
    .catch((err) => {
      return res.status(403).json({ err });
    });
};

exports.deleteBudget = (req, res) => {
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

  budgetModel
    .findByIdAndDelete(id)
    .then((budget) => {
      if (budget) {
        return res.status(200).json({
          success: true,
          data: { budget },
        });
      } else {
        return res
          .status(404)
          .json({ msg: `Cannot find budget with ID: ${id}` });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(403).json({ error: err.message });
      }
      return res.status(500).json({ error: "Internal Server Error" });
    });
};
