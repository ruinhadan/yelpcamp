const mongoose = require('mongoose');
const express = require('express');
const Campground = require('./models/campground');
const path = require('path')
const methodOverride = require('method-override')
const engine = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const catchAsync = require('./utils/catchAsync')
const Joi = require('joi')
const { campgroundSchema } = require('./schemas.js')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
        console.log("Database connected");
});

const app = express()

app.engine('ejs', engine)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

const validateCampground = (req, res, next) => {
        const { error } = campgroundSchema.validate(req.body);
        if (error) {
                const msg = error.details.map(e => e.message).join(',');
                throw new ExpressError(msg, 400)
        } else {
                next();
        }
}

app.get('/', (req, res) => {
        res.render('home')
})

app.get('/campgrounds', catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
}))

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
        const newCampground = new Campground(req.body.campground);
        await newCampground.save()
        res.redirect(`/campgrounds/${newCampground._id}`)
}))

app.get('/campgrounds/new', (req, res) => {
        res.render('campgrounds/new')
})

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
        const { id } = req.params;
        await Campground.findByIdAndUpdate(id, req.body.campground)
        res.redirect(`/campgrounds/${id}`)
}))

app.delete('/campgrounds/:id/delete', catchAsync(async (req, res, next) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id)
        res.redirect('/campgrounds')
}))

app.all('*', (req, res, next) => {
        next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
        const { statusCode = 500 } = err;
        if (!err.message) err.message = 'Oops, something went wrong!';
        res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
        console.log('Listening on port 3000')
})