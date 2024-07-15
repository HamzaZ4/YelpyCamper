const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});

  res.render("campgrounds/index", { campgrounds });
}

module.exports.renderNewForm = (req, res) => {

  res.render("campgrounds/new");

}

module.exports.postNewCamp = async (req, res, next) => {
  
  
  const camp = new Campground(req.body.campground);
  camp.images = req.files.map(f => ({url: f.path, filename: f.filename}))
  camp.author = req.user._id;
  await camp.save();
  console.log(camp)

  req.flash('success','successfuly made a new campground')
  res.redirect(`/campgrounds/${camp._id}`);


}


module.exports.getSpecificCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate({
    path:'reviews',
    populate:{
      path: 'author'
    }
  }).populate('author');
  
  
  if(!campground){
    req.flash('error','Cannot find campground');
    res.redirect('/campgrounds')
  }else{
      res.render("campgrounds/show", { campground });
  }
 
}

module.exports.editCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if(!campground){
    req.flash('error','Cannot find campground');
    return res.redirect('/campgrounds')
  }
      res.render("campgrounds/edit", { campground });
  
  
}


module.exports.updatedCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);


  await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true }
  );

  req.flash('success',"Successfully updated campground");
  res.redirect(`/campgrounds/${id}`);
}

module.exports.destroyCampground = async (req, res) => {
  const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
  
  

  

}