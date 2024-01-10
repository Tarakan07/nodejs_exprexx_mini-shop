const Router = require("express");
const router = new Router();
const checkAuth = require("../middleware/checkAuthMiddleware");
const basketController = require("../controllers/basketController");
router.get("/:userId", basketController.getBasket);
router.post("/", basketController.create);
router.delete("/", basketController.delete);
module.exports = router;
