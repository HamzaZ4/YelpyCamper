const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose= require('passport-local-mongoose');


const userSchema = new Schema({
  email: {
    type:String,
    require:true,
    unique:true,
  }

})

userSchema.plugin(passportLocalMongoose); //adds onto our schema the username and password with proper validation

module.exports = mongoose.model('User',userSchema)