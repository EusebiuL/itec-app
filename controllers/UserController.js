const router = require("express").Router();
const middleware = require("../middleware/AuthMiddleware");
const userService = require("../services/UserService");

router.post("/login", userService.login);
router.post("/register", userService.register);
router.get("/users", middleware, userService.getUsers);

module.exports = router;
