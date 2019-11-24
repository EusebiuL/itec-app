const router = require("express").Router();
const middleware = require("../middleware/AuthMiddleware");
const userService = require("../services/UserService");

router.post("/login", userService.login);
router.post("/register", userService.register);
router.get("/users", userService.getUsers);
router.get("/buyers", userService.getBuyers);
router.get("/sellers", userService.getSellers);
router.get("/user/:id", userService.getById);
router.delete("/user/logout", middleware, userService.logout);

module.exports = router;
