const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
}

module.exports.newCampground = async (req, res, next) => {
        const newCampground = new Campground(req.body.campground);
        newCampground.author = req.user._id;
        await newCampground.save()
        req.flash('success', 'Successfully added campground!')
        res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.renderNewForm = (req, res) => {
        res.render('campgrounds/new')
}

module.exports.showCampground = async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
        if (!campground) {
                req.flash('error', 'Campground not found :(')
                return res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground })
}

module.exports.renderEditForm = async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground) {
                req.flash('error', 'Campground not found :(')
                return res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { campground })
}

module.exports.editCampground = async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findByIdAndUpdate(id, req.body.campground)
        req.flash('Campground details updated successfully')
        res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id)
        req.flash('success', 'Campground deleted successfully')
        res.redirect('/campgrounds')
}