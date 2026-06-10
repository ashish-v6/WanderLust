const {model} = require("mongoose");
const {Schema} = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema({
    email : {
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose.default);
const User = model("user",userSchema);

module.exports = User;