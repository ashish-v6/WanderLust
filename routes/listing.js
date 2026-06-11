const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require("../models/schemaValidation.js");
const { isLoggedIn, isOwner, setGeoData } = require("../utils/middlewares.js");
const controllers = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../config/cloudConfig.js");
const upload = multer({storage});


//combine route for "/"
router
  .route("/")
  .get(wrapAsync(controllers.getAllListings))
  .post(isLoggedIn, validateListing, upload.single("listing[image]"), setGeoData,  wrapAsync(controllers.setNewListing));

//create(new) route (above show route bcz if at bottom the /new will be treated as id)
router.get("/new", isLoggedIn, controllers.getNewListingPage);

//combine route for "/:id"
router
  .route("/:id")
  .get(wrapAsync(controllers.showListing))
  .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, setGeoData, wrapAsync(controllers.setUpdates))
  .delete(isLoggedIn, isOwner, wrapAsync(controllers.destroyListing));

//update(edit) route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(controllers.getUpdatePage),
);

module.exports = router;

//index route
// router.get("/", wrapAsync(controllers.getAllListings));

//create route
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(controllers.setNewListing),
// );

//Read(show) route
// router.get("/:id", wrapAsync(controllers.showListing));

//update route
// router.put(
  //   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(controllers.setUpdates),
// );

//destroy route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(controllers.destroyListing),
// );
