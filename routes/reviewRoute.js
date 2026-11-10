const express = require("express");
const {
    retrieveAllReviews,
    retrieveReviewById,
    createReview,
    updateReview,
    deleteReview,
    getReviewDetails
} = require('../controller/ReviewController.js');

const reviewRouter = express.Router();

reviewRouter.get("/details", getReviewDetails);

reviewRouter.get("/", retrieveAllReviews);

reviewRouter.get("/:id", retrieveReviewById);

reviewRouter.post("/", createReview);

reviewRouter.put("/:id", updateReview);

reviewRouter.delete("/:id", deleteReview);

module.exports = reviewRouter;