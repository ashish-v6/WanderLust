const mongoose = require("mongoose");
const Review = require("./review.js");


const listingSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
    description : String,
    image : {
        filename : String,
        url : String
    },
    price : {
        type : Number,
        require : true,
    },
    location : {
        type : String,
        require : true
    },
    country : {
        type : String,
        require : true
    },
    category : {
        type : String,
        enum : ["mountain", "beach", "city", "resort", "cafe", "villa", "banglow", "flat", "jungle"],
        default : "villa"
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "review"
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        default : [28.6448,77.2167],
        required: true
    }
});

//mongoose middleware, run when "findOneAndDelete" or "findByIdAndDelete" is ran by any route
listingSchema.post("findOneAndDelete",async (listing) =>{
    if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("listing",listingSchema);

module.exports = Listing;