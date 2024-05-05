const express = require("express");
const controller = require("../controllers/budgetController");
const router = express.Router();
router.get("/budgets", controller.getBudgets);
router.get("/getbudget/:id", controller.getBudget);
router.post("/addbudget", controller.addBudget);
router.put("/updatebudget/:id", controller.updateBudget);
router.delete("/deletebudget/:id", controller.deleteBudget);
module.exports = router;
