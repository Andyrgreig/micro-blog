const Blog = require("../models/blog");
const { body, validationResult } = require("express-validator");

exports.getBlog = (req, res) => {
  res.status(200).render("index", { user: req.user });
};
