const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrap.js");//not an error
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview, isLoggedIn, isOwner, isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js")

//reviews
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
 
 //delete review route
 router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));

 module.exports=router;
 
 