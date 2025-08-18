const Listing = require('./models/listing');
const Review = require('./models/review');
const {listingSchema} = require('./schema.js');
const ExpressError = require('./utils/ExpressError');
const {reviewSchema} = require('./schema.js');

module.exports.isLoggedIn = (req, res, next) => {
    // to authenticate the user is log in to create a new post here!
    
    // if user is not authenticated, redirect to login page
    if(!req.isAuthenticated()) {
        // redirect url save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create the listing!");
        return res.redirect('/login');
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    // save the redirect url to session
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have access to update!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(! review.author.equals(res.locals.currentUser._id)) {
        req.flash("error", "You don't have access to update!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Joi function to show error on server side validation
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};