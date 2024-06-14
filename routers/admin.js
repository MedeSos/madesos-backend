const express = require("express");
const userController = require("../controllers/userController");
const blogPostController = require("../controllers/blogPostController");
const imagePostController = require("../controllers/imagePostController");
const videoPostController = require("../controllers/videoPostController");

const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//Route User
router.post("/user", userController.register);
router.get("/user/:id", userController.singleUser);
router.patch("user/:id/edit", userController.editUser);

//Route BlogPost
router.get("/blog", blogPostController.getAllBlogPost);
router.get("/blog/:id", blogPostController.singleBlogPost);
router.post("/blog", blogPostController.createBlogPost);
router.delete("/blog/:id", blogPostController.deleteBlogPost);
router.patch("/blog/:id/edit", blogPostController.editBlogPost);

//Route ImagePost
router.get("/image", imagePostController.getAllImagePost);
router.get("/image/:id", imagePostController.singleImagePost);
router.post("/image", imagePostController.createImagePost);
router.delete("/image/:id", imagePostController.deleteImagePost);
router.patch("/image/:id/edit", imagePostController.editImagePost);

//Route VideoPost
router.get("/video", videoPostController.getAllVideoPost);
router.get("/video/:id", videoPostController.singleVideoPost);
router.post("/video", videoPostController.createVideoPost);
router.delete("/video/:id", videoPostController.deleteVideoPost);
router.patch("/video/:id/edit", videoPostController.editVideoPost);
module.exports = router;
