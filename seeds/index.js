const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')

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

const randomSampler = array => array[Math.floor(Math.random() * array.length)];

const seedDatabase = async () => {
        await Campground.deleteMany({});
        for (let i = 0; i < 50; i++) {
                const city = randomSampler(cities);
                const price = Math.floor(Math.random() * 30) + 20;
                const campground = new Campground({
                        author: '60b38ffd4617d33090789986',
                        location: `${city.city}, ${city.state}`,
                        title: `${randomSampler(descriptors)} ${randomSampler(places)}`,
                        description: 'Kimi to natsu no owari, sed laip, sed song, saddddddddddddddd',
                        image: 'https://source.unsplash.com/collection/2257479',
                        price
                })
                await campground.save();
        }
}


seedDatabase().then(() => {
        mongoose.connection.close();
})