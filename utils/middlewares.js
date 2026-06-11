const Listing = require("../models/listing");
const Review = require("../models/review");
const passport = require("passport");

module.exports.authUser = passport.authenticate("local",{
    failureRedirect : "/login",
    failureFlash : true
})

//middleware for the user validation
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirect = req.originalUrl;
        req.flash("error","You have to log in first");
        return res.redirect("/login");
    }
    next();
}

//to save redirect url 
module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirect){
        res.locals.redirect = req.session.redirect;
    }
    else{
        res.locals.redirect = "/listings";
    }
    next();
}

module.exports.isOwner = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(req.user._id)){
        req.flash("error","You are don't have permission");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isAuthor = async (req,res,next) =>{
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash("error","Unauthorized Acces");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.setGeoData = async (req,res,next) =>{
    const response = await fetch(
        `https://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_KEY}&query=${req.body.listing.location}`
    );
    const data = await response.json();
    req.body.listing.coordinates = [data.data[0].latitude,data.data[0].longitude];
    next();
}