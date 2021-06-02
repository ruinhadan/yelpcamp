const express = require('express');
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync')
const Joi = require('joi')
const { campgroundSchema } = require('../schemas.js')
const ExpressError = require('../utils/ExpressError')
const router = express.Router();
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')



router.get('/', catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
}))

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
        const newCampground = new Campground(req.body.campground);
        newCampground.author = req.user._id;
        await newCampground.save()
        req.flash('success', 'Successfully added campground!')
        res.redirect(`/campgrounds/${newCampground._id}`)
}))

router.get('/new', isLoggedIn, (req, res) => {
        res.render('campgrounds/new')
})

router.get('/:id', catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
        if (!campground) {
                req.flash('error', 'Campground not found :(')
                return res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground) {
                req.flash('error', 'Campground not found :(')
                return res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res, next) => {
        const { id } = req.params;
        await Campground.findByIdAndUpdate(id, req.body.campground)
        if (!campground) {
                req.flash('error', 'Campground not found :(')
                return res.redirect('/campgrounds');
        }
        req.flash('Campground details updated successfully')
        res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:id/delete', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id)
        req.flash('success', 'Campground deleted successfully')
        res.redirect('/campgrounds')
}))

module.exports = router;