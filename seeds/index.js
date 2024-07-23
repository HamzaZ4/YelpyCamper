const {places,descriptors} = require('./seedhelpers');

const cities = require('./cities');
const mongoose = require('mongoose');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelpy-camper');
const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));

db.once("open",()=>{
  console.log("Database connected");
})


const randArrayElement = (array)=> array[Math.floor(Math.random()*array.length)];



const seedDB= async()=>{
  await Campground.deleteMany({});
  for(let i=0;i<200;i++){
    const random100 = Math.floor(Math.random()*100);
    const price= Math.floor(Math.random()*20)+10;
    const camp = new Campground({
      location: `${cities[random100].city}, ${cities[random100].province}`,
      title: `${randArrayElement(descriptors)} ${randArrayElement(places)}`,
      geometry: { type: 'Point', coordinates: [cities[random100].longitude, cities[random100].latitude]},
      images: [
        {
          url: 'https://res.cloudinary.com/ddzczvzfo/image/upload/v1721243719/YelpyCamper/u8lydaqeohtbvyln4ggg.jpg',
          filename: 'YelpyCamper/u8lydaqeohtbvyln4ggg',
          
        }],
      description: 'Real cool campground, I really liked fishing branches and leaves.'
      ,price,
      author: '6692c4628caf72c65877b4f1',
      

    })
    await camp.save();
  }
}

seedDB().then(()=> mongoose.connection.close());