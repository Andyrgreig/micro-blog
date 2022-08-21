const express = require("express");
const blog = require("../controllers/blogController");

const router = express.Router();

// GET home page
router.get("/", blog.getBlog);

router.get("/create-blog", blog.getCreateBlog);

router.post("/create-blog", blog.postCreateBlog);

router.get("/:id/update", blog.getUpdateBlog);

router.post("/:id/update", blog.postUpdateBlog);

router.get("/:id/delete", blog.getDeleteBlog);

router.get("/unauthorised", blog.getUnauthorised);

router.post("/:id/delete", blog.postDeleteBlog);

module.exports = router;
