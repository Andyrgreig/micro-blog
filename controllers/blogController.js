const Blog = require("../models/blog");
const { body, validationResult } = require("express-validator");
const { render } = require("pug");

exports.getBlog = (req, res) => {
  Blog.find()
    .populate("author")
    .sort("timestamp")
    .then((blogs) => {
      res.status(200).render("index", { user: req.user, blogs: blogs });
    });
};

exports.getCreateBlog = (req, res) => {
  console.log(req.user);
  let auth = false;
  if (req.user) {
    auth = true;
  }
  if (auth) {
    res.status(200).render("create-blog", {
      title: "Create Blog",
      blogTitle: "",
      blogText: "",
      tags: "",
    });
  } else {
    res.redirect("/unauthorised");
  }
};

exports.postCreateBlog = [
  //Validate and sanitise inputs
  body("blogTitle", "Title required").trim().isLength({ min: 3 }).escape(),
  body("blogText", "Blog text required").trim().isLength({ min: 3 }).escape(),
  // Process request after validation and sanitisation.
  (req, res) => {
    // Extract the validation errors from a request.

    console.log(req.body);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("create-blog", {
        errors: errors.array(),
        title: "Create Blog",
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
        tags: req.body.tags,
      });
      return;
    } else {
      const newBlog = new Blog({
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
        tags: req.body.tags,
        author: req.user._id,
        timestamp: new Date().toString(),
      });

      newBlog.save().then((user) => {
        console.log(`New blog created: ${req.body.blogTitle}`);
      });

      res.redirect("/");
    }
  },
];

exports.getUpdateBlog = (req, res) => {
  let auth = false;
  if (req.user) {
    auth = req.user.admin;
  }
  if (auth) {
    Blog.findById(req.params.id)
      .populate("author")
      .then((result) => {
        res.status(200).render("update-blog", {
          title: "Update Blog",
          url: result.updateUrl,
          blogTitle: result.blogTitle,
          blogText: result.blogText,
          tags: result.tags,
        });
      });
  } else {
    res.redirect("/unauthorised");
  }
};

exports.postUpdateBlog = [
  body("blogTitle", "Title required").trim().isLength({ min: 3 }).escape(),
  body("blogText", "Blog text required").trim().isLength({ min: 3 }).escape(),
  // Process request after validation and sanitisation.
  (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    console.log(errors);

    const updates = {
      title: req.body.blogTitle,
      body: req.body.blogText,
      tags: req.body.tags,
    };

    // If there are errors. Render the form again with sanitized values/error messages.
    if (!errors.isEmpty()) {
      res.render("update-blog", {
        errors: errors.array(),
        title: "Update Blog",
        blogTitle: req.body.blogTitle,
        blogText: req.body.blogText,
        tags: req.body.tags,
      });
      return;
    } else {
      Blog.findByIdAndUpdate(req.params.id, updates)
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
];

exports.getUnauthorised = (req, res) => {
  res.status(401).render("unauthorised");
};

exports.getDeleteBlog = (req, res) => {
  let auth = false;
  if (req.user) {
    auth = req.user.admin;
  }
  if (auth) {
    Blog.findById(req.params.id)
      .populate("author")
      .then((result) => {
        res.status(200).render("delete-blog", {
          title: "Delete Blog",
          blog: result,
        });
      });
  } else {
    res.redirect("/unauthorised");
  }
};

exports.postDeleteBlog = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id, function (err, docs) {
    if (err) {
      console.log(err);
    } else {
      console.log("Deleted : ", id);
    }
    res.redirect("/");
  });
};
