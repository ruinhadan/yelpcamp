const express = require('express');
const Review = require('../models/review');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi')
const { reviewSchema } = require('../schemas.js')
const ExpressError = require('../utils/ExpressError')
const router = express.Router({ mergeParams: true });

const validateReview = (req, res, next) => {
        const { error } = reviewSchema.validate(req.body);
        if (error) {
                const msg = error.details.map(e => e.message).join(',');
                throw new ExpressError(msg, 400)
        } else {
                next();
        }
}

router.post('/', validateReview, catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const review = new Review(req.body.review);
        const campground = await Campground.findById(id);
        campground.reviews.push(review);
        await review.save();
        await campground.save();
        req.flash('success', 'Successfully added review!')
        res.redirect(`/campgrounds/${id}`);
}))

router.delete('/:reviewId', catchAsync(async (req, res, next) => {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully deleted review')
        res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
