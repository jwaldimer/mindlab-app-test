const express = require("express");
const auth_controller = require("../controllers/authController");

const router = express.Router();

// POST /auth/signin
router.post("/signin", auth_controller.signin);

module.exports = router;
