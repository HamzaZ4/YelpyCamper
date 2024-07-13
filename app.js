const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const session= require('express-session')
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const flash= require('connect-flash')
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local')
const reviewRoutes = require('./routes/reviews');
const campgroundRoutes = require('./routes/campgrounds')
const userRoutes = require('./routes/users')
const User = require('./models/user')

mongoose.connect("mongodb://localhost:27017/yelpy-camper");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
  console.log("Database connected");
});


const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')))
const sessionConfig = { 
  secret:'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie:{
    httpOnly:true,
    expires: Date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
  }
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error')
  next();
});
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())




app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)
app.use('/',userRoutes)

app.get('/',(req,res)=>{
  res.render('home')
})
app.get('/fakeUser',async(req,res)=>{
  const user = new User({email:'g@g.com',username:'Hamza'});
  const newuser = await User.register(user,'Hamza');
  res.send(newuser)
})

app.all('*',(req,res,next)=>{
  
  next(new ExpressError('Page not found', 404));

})


app.use((err,req,res,next)=>{
  const {statusCode=500} = err;
  if(!err.message) err.message = 'oh no, something went wrong!'
  res.status(statusCode).render('error',{err});


})





app.listen(3000, () => {
  console.log("serving on port 3000");
});
