const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrap.js");//not an error
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js")
const {isOwner}=require("../middleware.js")
const {validateListing}=require("../middleware.js")
const listingController=require("../controllers/listings.js")
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage})

//listing route and create route using router.route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

//new route(watch vid8-4:25 to of phase1 to know why we kept new route before show route and write it)
router.get("/new",isLoggedIn,listingController.renderNewForm);

//show,update and delete using router.route
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

module.exports=router;

