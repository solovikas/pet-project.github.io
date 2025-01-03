const Router = require("express");
const router = new Router();
const genreController = require("../controllers/genreController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), genreController.create);
router.post("/addphoto", checkRole("ADMIN"), genreController.addPhoto);
router.post("/addinfo", checkRole("ADMIN"), genreController.addInfo);
router.get("/", genreController.getAll);
router.get("/:id", genreController.getCertain);

module.exports = router;
