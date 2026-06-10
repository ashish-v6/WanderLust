if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const dns = require("dns");
dns.setServers([
    '1.1.1.1',
    '8.8.8.8'
])

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const {MongoStore} = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const {connDB} = require("./config/db.config.js");
connDB(process.env.ATLAS);

app.engine("ejs",ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(session({
    store : MongoStore.create({
        mongoUrl : process.env.ATLAS,
        crypto : {
            secret : process.env.SECRET
        },
        touchAfter : 23 * 3600
    }),
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true
}))

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.mapKey = process.env.MAP_KEY;
    if(req.user){
        res.locals.currUser = req.user;
    }
    else{
        res.locals.currUser = null;
    }
    next();
})

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.use("/listings",listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/",userRouter);

app.get("/",(req,res)=>{
    res.redirect("/listings");
})

app.all(/(.*)/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err,req,res,next) =>{
    let {status= 500, message="Error1142"} = err;
    console.log(err);
    res.status(status).render("listings/error.ejs",{err});
})

app.listen(3000,() =>{
    console.log("Connected to server on 3000");
})