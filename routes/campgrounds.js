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

const campgrounds = require('../controllers/campgrounds')

router.route('/')
  .get( catchAsync(campgrounds.index))
  .post( validateCampground, catchAsync(campgrounds.postNewCamp));


router.get("/new",isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
  .get(catchAsync(campgrounds.getSpecificCampground))
  .put(isLoggedIn,isAuthor,  validateCampground,catchAsync(campgrounds.updatedCampground))
  .delete(isLoggedIn,isAuthor,catchAsync( campgrounds.destroyCampground));

router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync( campgrounds.editCampground))

  






module.exports = router;