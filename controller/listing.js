const Listing = require("../models/listing.js");

//home route
module.exports.getAllListings = async (req, res) => {
  let allListings = await Listing.find();
  res.render("listings/index.ejs", { allListings });
};

//add new listing route
module.exports.getNewListingPage = (req, res, next) => {
  try {
    res.render("listings/new.ejs");
  } catch (err) {
    next(err);
  }
};

//show a specific listing route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  } else {
    res.render("listings/show.ejs", { listing });
  }
};

//add new listing route
module.exports.setNewListing = async (req, res, next) => {
  let newList = new Listing(req.body.listing);
  let url = req.file.path;
  let filename = req.file.filename;
  newList.image = {url, filename};
  let list = await newList.save();
  if (list) {
    list.owner = req.user._id;
    await list.save();
    req.flash("success", "Added new Listing");
  }
  res.redirect("/listings");
};

//get update page for a listing route
module.exports.getUpdatePage = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  } else {
    res.render("listings/edit.ejs", { listing });
  }
};

//set upates for a listing route
module.exports.setUpdates = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (list) {
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let pathname = req.file.pathname;
      list.image = {url, pathname};
      await list.save();
    }
    req.flash("success", "Updated Listing");
  }
  res.redirect(`/listings/${id}`);
};

//delete listing route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  if (!listing) {
    req.flash("error", "Listing not found");
  } else {
    req.flash("success", "Listing Deleted");
  }
  res.redirect("/listings");
};
