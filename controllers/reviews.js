const Campground = require('../models/campground')
const Review = require('../models/review');

module.exports.postReview=async(req,res,next)=>{

  const {id} = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);

  review.author = req.user;
  campground.reviews.push(review);

  await review.save();
  await campground.save();
  req.flash('success',"Review Posted!")
  res.redirect(`/campgrounds/${campground._id}`)

}

module.exports.destroyReview = async(req,res,next)=>{
  const {id, reviewId} = req.params;

  const campground = await Campground.findByIdAndUpdate(id,{ $pull : {reviews:reviewId}});

  const review = await Review.findById(reviewId);

  if(review.author.equals(req.user._id) ){
    await Review.findByIdAndDelete(reviewId);
  }
  req.flash('success',"Review Deleted!")
  res.redirect(`/campgrounds/${id}`)

}