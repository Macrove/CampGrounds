//Importing Mongoose

// CITIES AND SEEDHELPERS DATA WAS OBTAINED FROM UDEMY COURSE - WEB DEVELOPMENT BOOTCAMP

const mongoose = require('mongoose')
const Campground = require('../models/campground.js')
const { descriptors, places } = require('./seedHelpers.js')
const cities = require('./cities.js')

mongoose.connect('mongodb://localhost/yelpcamp',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Editing database')
})

//Function for producing random index
const randIndex = (arrayLength)=>{
    return Math.floor(Math.random()*arrayLength)
}

//Function to delete existing campgrounds and then create new set of campgrounds
//A random Campgrounds will have first name as a random descriptor followed by places 
const seedDb = async()=>{
    await Campground.deleteMany({})

    const numCities = cities.length
    const numDescriptors = descriptors.length
    const numPlaces = places.length


    const seedCampgrounds = []

    for(let i = 0 ; i<10 ; i++){
        let cityIndex = randIndex(numCities)
        seedCampgrounds.push({
            location : `${cities[cityIndex].city} ${cities[cityIndex].state}`,
            title : `${descriptors[randIndex(numDescriptors)]} ${places[randIndex(numPlaces)]}`
        })
    }
    await Campground.insertMany(seedCampgrounds)
}

// Filling seed data in database and closing connection
seedDb().then(()=>{
    mongoose.connection.close()
})