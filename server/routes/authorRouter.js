const Router = require("express");
const router = new Router();
const authorController = require("../controllers/authorController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), authorController.create);
router.get("/", authorController.getAll);
router.get("/liked", authorController.getLikedAuthors);
router.post("/add", authorController.addAuthor);
router.delete("/unadd:user_id/:author_id", authorController.unaddAuthor);
router.put("/:id", checkRole("ADMIN"), authorController.update);
router.delete("/:id", checkRole("ADMIN"), authorController.delete);

module.exports = router;
