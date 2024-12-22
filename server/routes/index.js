const Router = require("express");
const router = new Router();

const userRouter = require("./userRouter");
const albumRouter = require("./albumRouter");
const trackRouter = require("./trackRouter");
const authorRouter = require("./authorRouter");
const genreRouter = require("./genreRouter");

router.use("/user", userRouter);
router.use("/album", albumRouter);
router.use("/track", trackRouter);
router.use("/author", authorRouter);
router.use("/genre", genreRouter);

module.exports = router;
