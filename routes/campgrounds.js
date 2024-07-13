const express = require('express');
const router = express.Router({mergeParams:true});
const {campgroundSchema} = require('../schemas');
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const flash= require('connect-flash')
const {isLoggedIn} = require('../middleware')
const Joi = require('joi');
const {validateCampground, isAuthor} = require('../middleware')



router.get("", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render("campgrounds/index", { campgrounds });
}));


router.get("/new",isLoggedIn, (req, res) => {

    res.render("campgrounds/new");
  
  
});


router.post("", validateCampground, catchAsync(async (req, res, next) => {
  

  const camp = new Campground(req.body.campground);
  camp.author = req.user._id;
  await camp.save();

  req.flash('success','successfuly made a new campground')
  res.redirect(`/campgrounds/${camp._id}`);


}));


router.get("/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate({
    path:'reviews',
    populate:{
      path: 'author'
    }
  }).populate('author');
  
  
  if(!campground){
    req.flash('error','Cannot find campground');
    res.redirect('/campgrounds')
  }else{
      res.render("campgrounds/show", { campground });
  }
 
}));



router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync( async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if(!campground){
    req.flash('error','Cannot find campground');
    return res.redirect('/campgrounds')
  }
      res.render("campgrounds/edit", { campground });
  
  
}));



router.put("/:id",isLoggedIn,isAuthor,  validateCampground,catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);


  await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );

  req.flash('success',"Successfully updated campground");
  res.redirect(`/campgrounds/${id}`);
}));



router.delete("/:id",isLoggedIn,isAuthor,catchAsync( async (req, res) => {
  const { id } = req.params;

    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds/${campground._id}`);
  
  

  

}));





module.exports = router;