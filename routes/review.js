const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview } = require("../schema.js");
const { isLoggedIn, isAuthor } = require("../middlewares.js");
const controllers = require("../controller/review.js");

//review routes
//create route
router.post(
  "/", 
  isLoggedIn, 
  validateReview, 
  wrapAsync(controllers.setReview)
);

//delete route
router.post(
  "/:reviewId",
  isLoggedIn,
  isAuthor,
  wrapAsync(controllers.destroyReview)
);

module.exports = router;
