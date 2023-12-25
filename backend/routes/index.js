const express = require("express");
const authController = require("../controllers/authController");
const blogController = require("../controllers/blogController");
const commentController = require("../controllers/commentController");
const auth = require("../middleware/auth");

const router = express.Router();

// REGISTER
router.post("/register", authController.register);

// LOGIN
router.post("/login", authController.login);

// LOGOUT
router.post("/logout", auth, authController.logout);

//REFRESH TOKEN
router.get("/refresh", authController.refresh);

// CREATE BLOG
router.post("/blog", auth, blogController.createBlog);

// GET ALL BLOGS
router.get("/blogs", auth, blogController.getBlogs);

// GET BLOG BY ID
router.get("/blog/:id", auth, blogController.getBlogById);

// UPDATE BLOG
router.put("/blog/", auth, blogController.updateBlog);

// DELETE BLOG
router.delete("/blog/:id", auth, blogController.deleteBlog);

// CREATE COMMENT
router.post("/comment", auth, commentController.createComment);

// GET COMMENTS
router.get("/comment/:id", auth, commentController.getCommentsByBlogId);

module.exports = router;
