const express= require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport')
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users')

router.route('/register')
.get(users.register)
.post(catchAsync(users.registrationConfirmed));


router.route('/login')
.get(users.login)
.post(storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.loginConfirmed);

router.get('/logout',users.logout)
module.exports = router;