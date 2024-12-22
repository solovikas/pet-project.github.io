const Router = require("express");
const router = new Router();
const trackController = require("../controllers/trackController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), trackController.create);
router.get("/", trackController.getAll);
router.get("/:id", trackController.getCertain);
router.delete("/:id", checkRole("ADMIN"), trackController.delete);

module.exports = router;
