const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
 const wrapAsync=require("../utils/wrap.js");//not an error
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");//for same path before login in middleware.ejs
const userController=require("../controllers/users.js")


router.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local", { failureRedirect: '/login', failureFlash:true }),userController.Login);

router.get("/logout",userController.Logout)
router.get("/aboutDev",userController.aboutDev)

module.exports=router;