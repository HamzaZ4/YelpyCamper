const User = require('../models/user');
const { storeReturnTo } = require('../middleware');

module.exports.register = (req,res)=>{
  res.render('users/register')
}

module.exports.registrationConfirmed = async (req,res,next)=>{

  try{

    const {email, username, password} = req.body;
    const newUser = new User({email,username}  );
    const registeredUser = await User.register(newUser,password)
    registeredUser.save();
    req.login(registeredUser,(err)=>{
      if(err) return next(err);
      req.flash('success','Welcome to YelpyCamper');
      res.redirect('/campgrounds')
    })


  }catch(e){
    req.flash('error',e.message);
    res.redirect('/register')
  }
 
}

module.exports.login = (req,res)=>{
  res.render('users/login')
}

module.exports.loginConfirmed = (req,res)=>{

 
  const redirectUrl = res.locals.returnTo || '/campgrounds';
  
  req.flash('success','Welcome back')
  res.redirect(redirectUrl)

}

module.exports.logout = (req,res)=>{
  req.logout((err)=>{
    if(err){
      return next(err);
    }
    req.flash('success',"Successfully logged out");
    res.redirect('/login')
  });
  
}