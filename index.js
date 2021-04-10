const mongoose = require('mongoose');
const express = require('express');
const Campground = require('./models/campground');
const path = require('path')
const methodOverride = require('method-override')


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

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
        res.render('home')
})

app.get('/campgrounds', async (req, res) => {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
})

app.post('/campgrounds', async (req, res) => {
        const newCampground = new Campground(req.body.campground);
        await newCampground.save()
        res.redirect(`/campgrounds/${newCampground._id}`)
})

app.get('/campgrounds/new', (req, res) => {
        res.render('campgrounds/new')
})

app.get('/campgrounds/:id', async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render('campgrounds/show', { campground })
})

app.get('/campgrounds/:id/edit', async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndUpdate(id, req.body.campground)
        res.redirect(`/campgrounds/${id}`)
})

app.delete('/campgrounds/:id/delete', async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id)
        res.redirect('/campgrounds')
})

app.listen(3000, () => {
        console.log('Listening on port 3000')
})