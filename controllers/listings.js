const Listing = require('../models/listing');
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const token = process.env.MY_ACCESS_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: token });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
const listing = await Listing.findById(id).populate({path: "reviews", populate: { path: "author"},}).populate("owner");
    if(!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
    // let response = await geocodingClient.forwardGeocode({
    // query: 'New Delhi, India',
    // limit: 1
    // })
    // .send();
    // console.log(response);
    // res.send("Geocoding response received");
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner to the current user
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
};

module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    let originalImage = listing.image.url;
    let originalImageFile = originalImage.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", {listing, originalImageFile});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if(typeof req.file !== 'undefined') {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};