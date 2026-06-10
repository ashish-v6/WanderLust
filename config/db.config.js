const mongoose = require("mongoose");

const MONGO_URL = process.env.ATLAS;

module.exports.connDB = async (MONGO_URL ) =>{
    try{
        if(!MONGO_URL ){
            throw new Error ("URI was not Specified");
        }
        await mongoose.connect(MONGO_URL );
        console.log("mongoDB is connected");
    }catch(err){
        console.error("mongoDb is not connected : " + err);
    }
}
