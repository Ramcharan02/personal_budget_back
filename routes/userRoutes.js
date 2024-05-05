const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();
// POST Login Request
router.post("/login", controller.loginUser);
// POST Signup request
router.post("/signup", controller.createUser);
// Referesh access token
router.post("/refreshToken", controller.refreshToken);
module.exports = router;
