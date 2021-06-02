const express = require('express');

const catchAsync = require('../utils/catchAsync')
const Joi = require('joi')
const { reviewSchema } = require('../schemas.js')
const ExpressError = require('../utils/ExpressError')
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const reviews = require('../controllers/reviews')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.addReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;
