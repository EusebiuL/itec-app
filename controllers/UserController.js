const router = require("express").Router();

const userService = require("../services/UserService");

router.post("/login", userService.login);
router.post("/register", userService.register);

module.exports = router;
