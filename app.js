if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const methodOverride=require("method-override");
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const path=require("path");
const ejsMate=require("ejs-mate");//read abt this ..video2 2nd folder
// const Review=require("./models/review.js");
// const wrapAsync=require("./utils/wrap.js");//not an error
const ExpressError=require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("./schema.js");
const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
const dbUrl=process.env.ATLASDB_URL;
const store=MongoStore.create({
    mongoUrl :  dbUrl,
    crypto:{
        secret: process.env.SECRET,
          },
          touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("error in mongo store",err)
})


const sessionOptions={
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie :{
        expires: Date.now()+7*24*60*60*1000,//ye cookie expire ho jaegi after 7 days(24hr and follow on)
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};



app.use(session(sessionOptions));
app.use(flash());//hmesha routes ke pehle use

app.use(passport.initialize());
app.use(passport.session());//session you know
passport.use(new LocalStrategy(User.authenticate()));//authenticate passport-local-mongoose
// use static serialize and deserialize of model for passport session support.pbkdf2 hashing algo is used
passport.serializeUser(User.serializeUser());//Generates a function that is used by Passport to serialize(login) users into the session
passport.deserializeUser(User.deserializeUser());//Generates a function that is used by Passport to deserialize(logout) users into the session


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;//this for navbar ki user exist krta hai to signin and login dikhe..else sirf logout dikhe..navbar.ejs me
    next();
});




app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)//isiliye jab common part yaha likhe to routes me nhi
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"))
});

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


main()
.then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err);
});
async function main(){
    await mongoose.connect(dbUrl);
}


app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
     
});

app.listen(8080,()=>{
    console.log("Server is listening on port 8080")
});