const router = require("express").Router();
const middleware = require("../middleware/AuthMiddleware");
const productService = require("../services/ProductService");

router.get("/product/:id", productService.getById);
router.post("/product", middleware, productService.add);

module.exports = router;
