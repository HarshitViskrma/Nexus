const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync.js');
const {isLoggedIn, isReviewAuthor, validateReview} = require('../middleware.js');
const reviewController = require('../controllers/reviews.js');

// Post routes
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.postReview));

// Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;