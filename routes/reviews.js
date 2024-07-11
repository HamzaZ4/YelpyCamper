const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground')
const {reviewSchema,campgroundSchema} = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const flash= require('connect-flash')
const Joi = require('joi');



const validateReview = (req,res,next)=>{
  const {error} = reviewSchema.validate(req.body);

  if(error){
    const msg = error.details.map(e=> e.message).join(',');
    throw new ExpressError(msg,400)
  }else{
    next();
  }
}


router.get("/", (req, res) => {
  res.render("home");
});


router.post('',validateReview,catchAsync(async(req,res,next)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);

  campground.reviews.push(review);

  await review.save();
  await campground.save();
  req.flash('success',"Review Posted!")
  res.redirect(`/campgrounds/${campground._id}`)

}))

router.delete('/:reviewId',catchAsync(async(req,res,next)=>{
  const {id, reviewId} = req.params;

  const campground = await Campground.findByIdAndUpdate(id,{ $pull : {reviews:reviewId}});
  const review = await Review.findByIdAndDelete(reviewId);
  req.flash('success',"Review Deleted!")
  res.redirect(`/campgrounds/${id}`)

}))

module.exports = router;