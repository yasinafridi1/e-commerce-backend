const { existsSync } = require("fs");
const router = require("express").Router();

// Health check endpoint to check server status
router.get("/health", (req, res) => {
  return res.status(200).json({ message: "Server is up and running" });
});
router.use("/admin", AdminRoutes);

// to get images or videos
router.get(
  "/file/:fileName",
  AsyncWrapper(async (req, res, next) => {
    const { fileName } = req.params;
    if (!fileName) {
      return next(new ErrorHandler("File name is required", 400));
    }
    const filePath = path.join(__dirname, `../uploads/${fileName}`);
    console.log(filePath);
    if (!existsSync(filePath)) {
      return next(
        new ErrorHandler("File not found or may have been deleted", 404)
      );
    }
    res.sendFile(filePath);
  })
);

module.exports = router;
