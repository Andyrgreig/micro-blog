const express = require("express");
const user = require("../controllers/userController");

const router = express.Router();

router.post("/register", user.addNewUser);

router.get("/register", user.getNewUserForm);

//
//

router.get("/login", user.getLogIn);

router.post("/login", user.postLogIn);

router.get("/logout", user.logout);

module.exports = router;
