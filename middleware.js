const Listing=require("./models/listing");//for isOwner
const Review=require("./models/review")
const {listingSchema,reviewSchema}=require("./schema.js");//for validateListing
const ExpressError=require("./utils/ExpressError.js");//for validateListing

module.exports.isLoggedIn=(req,res,next)=>{
    console.log(req.user);
    if(!req.isAuthenticated())
        {
            req.session.redirectUrl=req.originalUrl;//isme session ke andar hi nya parameter create kr diye jisse sabko access ho iska
            req.flash("error","You must be logged in to create new Listing!");
            return res.redirect("/login");
        }
        next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=async(req,res,next)=>{//checks if we are the owner to edit and delete the listing
    let {id}=req.params;
   let listing=await Listing.findById(id);
   if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
   }
   next();

}
 module.exports.validateListing =(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }

};

module.exports.validateReview =(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }

};

module.exports.isReviewAuthor=async(req,res,next)=>{//checks if we are the owner to edit and delete the listing
    let {id,reviewId}=req.params;
   let review=await Review.findById(reviewId);
   if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review");
    return res.redirect(`/listings/${id}`);
   }
   next();

}