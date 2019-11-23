const router = require("express").Router();
const middleware = require("../middleware/AuthMiddleware");
const productService = require("../services/ProductService");

router.get("/product/:id", productService.getById);
router.get("/products/:id", productService.getAll);
router.get("/producta/search", productService.search);
router.post("/product", middleware, productService.add);
router.put("/product/:id/update", middleware, productService.update);
router.delete("/product/:id", middleware, productService.delete);

module.exports = router;
