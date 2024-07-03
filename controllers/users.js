const User=require("../models/user.js");


module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{//read about .login on npm passport..basically sign up ke baad phir se login na krna pde..sign up krte hi login
        if(err){
            return next(err)
        }
        req.flash("success","user registered successfully");
        res.redirect("/listings");
    })
   

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
    
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs")
}

module.exports.Login=async(req,res)=>{
    let {username}=req.body;
    req.flash("success",`Welcome back ${username} to WanderLust!`);
    let redirectUrl=res.locals.redirectUrl || "/listings"//because jab hum direct login kr rhe the page se to isLoggedIn nhi trigger ho rha tha jisse res.local.redirectUrl me kuch nhi jaa rha tha..isliey we || "/listings " jisse seedhe login kiye to /listings pr rhe
    res.redirect(redirectUrl);//middleware.ejs me defined hai

}

module.exports.Logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","logged you out!");

        res.redirect("/listings");
    })
}

module.exports.aboutDev=(req,res)=>{
    res.render("users/aboutDev")
}