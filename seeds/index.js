const { places, descriptors } = require("./seedhelpers");

const cities = require("./cities");
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const campImages = require("./campgroundImages").campImages;
mongoose.connect(
  "mongodb+srv://mcHamz72:<Password>@cluster0.tfj7y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("Database connected");
});

const randArrayElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 200; i++) {
    const random100 = Math.floor(Math.random() * 100);
    const price = Math.floor(Math.random() * 20) + 10;
    const campImage = campImages[Math.floor(Math.random() * campImages.length)];
    const camp = new Campground({
      location: `${cities[random100].city}, ${cities[random100].province}`,
      title: `${randArrayElement(descriptors)} ${randArrayElement(places)}`,
      geometry: {
        type: "Point",
        coordinates: [cities[random100].longitude, cities[random100].latitude],
      },
      images: [
        {
          url: campImage,
          filename: campImage,
        },
      ],
      description:
        "Real cool campground, I really liked fishing branches and leaves.",
      price,
      author: "66dc97fa9c6226af69cbc2a5",
    });
    await camp.save();
  }
};

seedDB().then(() => mongoose.connection.close());
