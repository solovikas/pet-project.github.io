const Router = require("express");
const router = new Router();
const albumController = require("../controllers/albumController");
const checkRole = require("../middleware/checkRoleMiddleware");

router.post("/", checkRole("ADMIN"), albumController.create);
router.get("/", albumController.getAll);
router.get("/liked", albumController.getLikedAlbums);
router.post("/add", albumController.addAlbum);
router.delete("/unadd/:user_id/:album_id", albumController.unaddAlbum);
router.delete("/:id", checkRole("ADMIN"), albumController.delete);

module.exports = router;
