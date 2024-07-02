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
  for(let i=0;i<50;i++){
    const random100 = Math.floor(Math.random()*100);
    const camp = new Campground({
      location: `${cities[random100].city}, ${cities[random100].province}`,
      title: `${randArrayElement(descriptors)} ${randArrayElement(places)}`
      
    })
    await camp.save();
  }
}

seedDB().then(()=> mongoose.connection.close());