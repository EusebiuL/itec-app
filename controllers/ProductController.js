const router = require("express").Router();
const middleware = require("../middleware/AuthMiddleware");
const productService = require("../services/ProductService");

router.get("/product/:id", productService.getById);
router.post("/product", middleware, productService.add);
router.put("/product/:id/update", middleware, productService.update);

module.exports = router;
