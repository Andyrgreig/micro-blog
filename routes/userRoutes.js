const express = require("express");
const user = require("../controllers/userController");

const router = express.Router();

router.post("/register", user.addNewUser);

router.get("/register", user.getNewUserForm);

router.get("/login", user.getLogIn);

router.post("/login", user.postLogIn);

router.get("/logout", user.logout);

router.get("/become-member", user.getBecomeMember);

router.get("/become-admin", user.getBecomeAdmin);

router.post("/become-member", user.postBecomeMember);

router.post("/become-admin", user.postBecomeAdmin);

module.exports = router;
