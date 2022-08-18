const express = require("express");
const blog = require("../controllers/blogController");

const router = express.Router();

// GET home page
router.get("/", blog.getBlog);

module.exports = router;
