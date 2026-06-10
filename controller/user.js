const User = require("../models/user.js");


module.exports.getSignupPage = (req,res) =>{
    res.render("users/signup.ejs");
}


module.exports.setUser = async (req,res) =>{
    try{
        let {username , email, password} = req.body;
        let newUser = new User({
            username : username,
            email : email
        })
        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser, (err) =>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.getLoginPage = (req,res) =>{
    res.render("users/login.ejs");
}

module.exports.loginUser = async(req,res) =>{
    req.flash("success","You have Logged in");
    res.redirect(res.locals.redirect);
}

module.exports.logoutUser = (req,res) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","You have been logged Out");
        res.redirect("/listings");
    })
}