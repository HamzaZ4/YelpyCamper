const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const Joi = require('joi');
const {campgroundSchema} = require('./schemas');

mongoose.connect("mongodb://localhost:27017/yelpy-camper");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.engine("ejs", ejsMate);

const validateCampground = (req,res,next)=>{
  
  const {error} = campgroundSchema.validate(req.body);
  

  if(error){
    const msg = error.details.map(e=> e.message).join(',');
    throw new ExpressError(msg,400)
  }else{
    next();
  }
  
}




app.get("/", (req, res) => {
  res.render("home");
});


app.get("/campgrounds", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render("campgrounds/index", { campgrounds });
}));


app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});


app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
  
  
  const camp = new Campground(req.body.campground);
  await camp.save();
  res.redirect("/campgrounds");


}));


app.get("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
}));

app.get("/campgrounds/:id/edit",catchAsync( async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
}));

app.put("/campgrounds/:id", validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );
  res.redirect(`/campgrounds/${id}`);
}));

app.delete("/campgrounds/:id",catchAsync( async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));


app.all('*',(req,res,next)=>{
  
  next(new ExpressError('Page not found', 404))
})


app.use((err,req,res,next)=>{
  const {statusCode=500} = err;
  if(!err.message) err.message = 'oh no, something went wrong!'
  res.status(statusCode).render('error',{err});


})


app.listen(3000, () => {
  console.log("serving on port 3000");
});
