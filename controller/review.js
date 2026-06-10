const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.setReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  req.flash("success", "Review added successfully");
  let review = new Review(req.body.review);
  review.author = req.user._id;
  await review.save();
  listing.reviews.push(review);
  await listing.save();
  console.log(listing);
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  req.flash("success", "Review deleted successfully");
  await listing.save();
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};
