const Review=require("../models/review.js");
const Listing=require("../models/listing.js");


module.exports.createReview=async(req,res)=>{///listings/:id/reviews
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`)
 
 };

 module.exports.destroyReview=async(req,res)=>{///listings/:id/reviews
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//ye review wale array me jaake wo review delete krre..pull se wo nikal diya..mongoose operator
    await Review.findById(reviewId);//ye wo review ki id delete krre
    req.flash("success","Review Deleted!");
    console.log("review deleted successfully");
    res.redirect(`/listings/${id}`);
}