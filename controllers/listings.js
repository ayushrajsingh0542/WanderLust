const Listing=require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken='pk.eyJ1IjoiYXl1c2gtc2luZ2giLCJhIjoiY2x5M3dvb3N6MGIxYTJrcXY1bTN1cXQ2biJ9.JgsuO-H2l7_yMUczIlA1Pg';
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings})
    
}

module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs")
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path:"author",
        },
}).populate("owner");
    if(!listing){
        req.flash("error","Listing does not exist!");//incase a wrong search
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing})

}

module.exports.createListing=async(req,res,next)=>{
    let response=await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send();
       
       
       
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing=new Listing(req.body.listing);//hmlog basically sabkuch pass krne ke bjay new.ejs me listing object bna kr pass kr diye wo value and then yaha pr body se listing le liye and phir parse krke instance bna liye
       newListing.owner=req.user._id;
       newListing.image={url,filename}
       newListing.geometry=response.body.features[0].geometry;
       let savedListing=await newListing.save();
       console.log(savedListing)
       req.flash("success","New Listing Created!");
       res.redirect("/listings");
   };

   module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing =await Listing.findById(id);
    if(!listing){
     req.flash("error","Listing does not exist!");//incase a wrong search
     res.redirect("/listings");
 }
    let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/h_300,w_250")//ye for preview image on edit form using cloudinary
    res.render("listings/edit.ejs",{listing,originalImageUrl})
 
 }

 module.exports.updateListing=async(req,res)=>{
   
    let {id}=req.params;
    
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});//deconstruct kiye taaki values mile phir unko purani values ki jgh daal diye
     
    if(typeof req.file !== 'undefined'){//checking agar usne koi image nhi di to uss case me naa update ho jaye image wrna khali parameters chle jange
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success","Listing Updated!");
     res.redirect(`/listings/${id}`);//return because wrna neeche wale bhi operations perform ho jange
 }

 module.exports.destroyListing=async(req,res)=>{

    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings")
 
 }