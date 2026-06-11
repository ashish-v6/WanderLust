const express = require("express");
const router = express.Router({ mergeParams: true });
const { saveRedirectUrl, authUser } = require("../utils/middlewares.js");
const controllers = require("../controller/user.js");

router
  .route("/signup")
  .get(controllers.getSignupPage)
  .post(controllers.setUser);

router
  .route("/login")
  .get(controllers.getLoginPage)
  .post(saveRedirectUrl, authUser, controllers.loginUser);

router.get("/logout", controllers.logoutUser);

module.exports = router;
