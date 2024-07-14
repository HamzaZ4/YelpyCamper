const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campground')
const {reviewSchema,campgroundSchema} = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review');
const flash= require('connect-flash')
const Joi = require('joi');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');
const reviews = require('../controllers/reviews');






router.post('',isLoggedIn, validateReview,catchAsync(reviews.postReview))

router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(reviews.destroyReview))

module.exports = router;