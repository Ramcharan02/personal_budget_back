const express = require("express");
const controller = require("../controllers/expenseController");
const router = express.Router();
//GET method for expenses
router.get("/expenses", controller.getExpenses);
router.get("/getexpense/:id", controller.getExpense);
router.post("/addexpense", controller.addExpense);
router.put("/updateexpense/:id", controller.updateExpense);
router.delete("/deleteexpense/:id", controller.deleteExpense);
module.exports = router;
