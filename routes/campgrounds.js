const express = require('express');
const router = express.Router({mergeParams:true});
const {campgroundSchema} = require('../schemas');
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const flash= require('connect-flash')
const {isLoggedIn} = require('../middleware')
const Joi = require('joi');

const validateCampground = (req,res,next)=>{
  
  const {error} = campgroundSchema.validate(req.body);
  

  if(error){
    const msg = error.details.map(e=> e.message).join(',');
    throw new ExpressError(msg,400)
  }else{
    next();
  }
  
}



router.get("", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render("campgrounds/index", { campgrounds });
}));


router.get("/new",isLoggedIn, (req, res) => {

    res.render("campgrounds/new");
  
  
});


router.post("", validateCampground, catchAsync(async (req, res, next) => {
  

  const camp = new Campground(req.body.campground);
  await camp.save();

  req.flash('success','successfuly made a new campground')
  res.redirect(`/campgrounds/${camp._id}`);


}));


router.get("/:id", isLoggedIn,catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews');
  if(!campground){
    req.flash('error','Cannot find campground');
    res.redirect('/campgrounds')
  }else{
      res.render("campgrounds/show", { campground });
  }
 
}));



router.get("/:id/edit",isLoggedIn,catchAsync( async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if(!campground){
    req.flash('error','Cannot find campground');
    res.redirect('/campgrounds')
  }else{
      res.render("campgrounds/edit", { campground });
  }
  
}));



router.put("/:id", validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );

  req.flash('success',"Successfully updated campground");
  res.redirect(`/campgrounds/${id}`);
}));



router.delete("/:id",isLoggedIn,catchAsync( async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);

  res.redirect("/campgrounds");

}));



// router.post('/:id/reviews',validateReview,catchAsync(async(req,res,next)=>{
//   const {id} = req.params;
//   const campground = await Campground.findById(id);
//   const review = new Review(req.body.review);

//   campground.reviews.push(review);

//   await review.save();
//   await campground.save();
//   res.redirect(`/campgrounds/${campground._id}`)

// }))

// router.delete('/:id/reviews/:reviewId',catchAsync(async(req,res,next)=>{
//   const {id, reviewId} = req.params;

//   const campground = await Campground.findByIdAndUpdate(id,{ $pull : {reviews:reviewId}});
//   const review = await Review.findByIdAndDelete(reviewId);
//   res.redirect(`/campgrounds/${id}`)

// }))



module.exports = router;