const joi = require("joi");
const ExpressError = require("../utils/ExpressError");

const listingSchema = joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        price : joi.number().min(0).required(),
        category : joi.string().required(),
        country : joi.string().required(),
        location : joi.string().required(),
    }).required()
});

module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error) {
        throw new ExpressError(400, error);
    }
    next();
}

const reviewSchema = joi.object({
    review : joi.object({
        rating : joi.number().min(1).max(5).required(),
        comment : joi.string().required()
    })
})

module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,"validate error");
    }
    next();
}