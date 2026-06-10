const {Schema, default: mongoose} = require("mongoose");
const {model} = require("mongoose");


const reviewSchema = new Schema({
    comment : {
        type : String,
        require : true
    },
    rating : {
        type : Number,
        min : 1,
        max : 5,
        require : true
    },
    createdAt : {
        type : Date,
        default : new Date(Date.now())
    },
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    }
});

const Review = new model("review",reviewSchema);
module.exports = Review;