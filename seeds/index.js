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
                        geometry: { type: 'Point', coordinates: [city.longitude, city.latitude] },
                        description: 'Kimi to natsu no owari, sed laip, sed song, saddddddddddddddd',
                        images: [
                                { "url": "https://res.cloudinary.com/dkeb8gaim/image/upload/v1622737899/yelpcamp/dngwmevnm5hrwdb8ve1r.jpg", "filename": "yelpcamp/dngwmevnm5hrwdb8ve1r" },
                                { "url": "https://res.cloudinary.com/dkeb8gaim/image/upload/v1622737901/yelpcamp/g9pb0e9cr8ocnasz4lon.jpg", "filename": "yelpcamp/g9pb0e9cr8ocnasz4lon" }
                        ],
                        price
                })
                await campground.save();
        }
}


seedDatabase().then(() => {
        mongoose.connection.close();
})