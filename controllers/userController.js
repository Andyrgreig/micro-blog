const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const generatePassword = require("../passwordUtilities").generatePassword;
require("dotenv").config();

exports.getNewUserForm = (req, res) => {
  res.status(200).render("register");
};

exports.addNewUser = [
  //Validate and sanitise inputs
  body("username", "Username must be at least 3 characters long")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("password", "Password must be at least 8 characters long")
    .trim()
    .isLength({ min: 8 })
    .escape(),
  body("passwordConfirmation").custom((value, { req }) => {
    if (req.body.confirmPassword !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  // Process request after validation and sanitisation.
  (req, res) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("register", { errors: errors.array() });
      return;
    } else {
      {
        console.log("Add new user");
        const saltHash = generatePassword(req.body.password);

        const salt = saltHash.salt;
        const hash = saltHash.hash;

        const newUser = new User({
          username: req.body.username,
          hash: hash,
          salt: salt,
          member: false,
          admin: false,
        });

        newUser.save().then((user) => {
          console.log(user);
        });

        res.redirect("/login");
      }
    }
  },
];

exports.getLogIn = (req, res) => {
  res.status(200).render("login");
};

exports.postLogIn = passport.authenticate("local", {
  failureRedirect: "/login",
  successRedirect: "/",
});

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(req.get("referer"));
  });
};

exports.getBecomeMember = (req, res) => {
  if (!req.user) {
    res.status(200).redirect("login");
  } else if (req.user.admin || req.user.member) {
    res.status(200).redirect("/");
  } else {
    res.status(200).render("become-member");
  }
};

exports.getBecomeAdmin = (req, res) => {
  if (!req.user) {
    res.status(200).redirect("login");
  } else if (!req.user.member) {
    res.status(200).redirect("become-member");
  } else if (req.user.admin) {
    res.status(200).redirect("/");
  } else {
    res.status(200).render("become-admin");
  }
};

exports.postBecomeMember = [
  // Validate and sanitise password field
  body("password", "Incorrect password")
    .trim()
    .escape()
    .equals(process.env.MEMBER),
  (req, res) => {
    const errors = validationResult(req);

    const update = {
      username: req.user.username,
      hash: req.user.hash,
      salt: req.user.salt,
      member: true,
      admin: req.user.admin,
    };

    // If there are errors. Render the form again with sanitized values/error messages.
    if (!errors.isEmpty()) {
      res.render("become-member", {
        errors: errors.array(),
      });
      return;
    } else {
      User.findByIdAndUpdate(req.user.id, update)
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
];

exports.postBecomeAdmin = [
  // Validate and sanitise password field
  body("password", "Incorrect password")
    .trim()
    .escape()
    .equals(process.env.ADMIN),
  (req, res) => {
    const errors = validationResult(req);

    const update = {
      username: req.user.username,
      hash: req.user.hash,
      salt: req.user.salt,
      member: req.user.member,
      admin: true,
    };
    // If there are errors. Render the form again with sanitized values/error messages.
    if (!errors.isEmpty()) {
      res.render("become-admin", {
        errors: errors.array(),
      });
      return;
    } else {
      User.findByIdAndUpdate(req.user.id, update)
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
];
