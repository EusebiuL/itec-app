const router = require("express").Router();
const middleware = require("../middleware/AuthMiddleware");
const productService = require("../services/ProductService");
const basketService = require("../services/BasketService");

//product-related endpoints
router.get("/product/:id", productService.getById);
router.get("/products/:id", productService.getAll);
router.get("/prod/search", productService.search);
router.post("/product", middleware, productService.add);
router.put("/product/:id/update", middleware, productService.update);
router.delete("/product/:id", middleware, productService.delete);

//shopping cart
router.get("/basket/:id", basketService.getById);
router.get("/basket/buyer/:id", basketService.getByBuyer);
router.put("/basket", basketService.updateBasket);

// payment -- checkout
router.post("/product/buy", middleware, productService.buyProduct);

//order -- related
router.get("/history/:id", basketService.getOrderHistory);

//wishlist -- related
router.put("/wishlist/product/:id", productService.updateWishlist);
router.get("/wishlist/:id", productService.getWishlist);
router.delete("/wishlist/product/:id", productService.removeFromWishlist);

module.exports = router;
