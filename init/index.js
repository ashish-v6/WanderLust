const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
main().then((result)=>{
    console.log("Connected");
})
.catch((error)=>{
    console.log(error)
})

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

async function initDB() {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj, owner : "6a1ef82c620f422ef64994cc"}))
    await Listing.insertMany(initData.data); // the require gives object of exported datas
    console.log("Data Initalized");
}

initDB();
