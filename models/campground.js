const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const imageSchema = new Schema({
  url: String,
  filename: String
});

imageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload','/upload/w_200')
})

const CampgroundSchema = new Schema({
  title:String,
  geometry:{
    type: {
      type: String,
      enum:['Point'],
      required:true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
  price:Number,
  description:String,
  location:String,
  images: [
    imageSchema
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