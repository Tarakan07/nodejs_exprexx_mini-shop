const Router = require("express");
const router = new Router();
const ratingController = require("../controllers/ratingController");
const checkAuth = require("../middleware/checkAuthMiddleware");
router.post("/", checkAuth, ratingController.create);
router.get("/:id", ratingController.getOne);
router.delete("/:id", checkAuth, ratingController.delete);
module.exports = router;
