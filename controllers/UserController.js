const router = require("express").Router();
const middleware = require("../middleware/AuthMiddleware");
const userService = require("../services/UserService");

router.post("/login", userService.login);
router.post("/register", userService.register);
router.get("/users", middleware, userService.getUsers);
router.get("/buyers", middleware, userService.getBuyers);
router.get("/sellers", middleware, userService.getSellers);
router.get("/user/:id", userService.getById);

module.exports = router;
