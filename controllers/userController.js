const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const bcryptjs = require("bcryptjs");
const generatePassword = require("../passwordUtilities").generatePassword;

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
