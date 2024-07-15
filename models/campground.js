const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');


const CampgroundSchema = new Schema({
  title:String,
  price:Number,
  description:String,
  location:String,
  images: [
    {
      url:String,
      filename:String,
    }
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ],
  author:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});


CampgroundSchema.post('findOneAndDelete', async function(data){
  if(data){
    await Review.deleteMany({_id: {$in: data.reviews}});
   }

})
module.exports = mongoose.model('Campground',CampgroundSchema);