const router = require("express").Router();
const middleware = require("../middleware/AuthMiddleware");
const resourceService = require("../services/ResourceService");
const multer = require("multer");

var storage = multer.diskStorage({
    destination: "../services/"
});
var upload = multer({ storage : storage}).any();

router.post("/resource/product/:id", upload, resourceService.uploadProductResource);
router.post("/resource/user/:id", upload, resourceService.uploadUserResource);


module.exports = router;