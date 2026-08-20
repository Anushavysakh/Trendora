const Review = require("../models/Review");
const User = require("../models/User");
// GET REVIEWS OF PRODUCT
const getReviews = async (req, res) => {
  try {

    const reviews = await Review.find({
      productId: req.params.productId
    }).sort({
      createdAt: -1
    });

    res.json(reviews);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ADD REVIEW
const addReview = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    const review = await Review.create({
      productId: req.body.productId,
      userId: req.user.id,
      userName: user.name,
      rating: req.body.rating,
      comment: req.body.comment
    });

    res.status(201).json(review);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const getAllReviews = async (req, res) => {
  try {

    const reviews = await Review.find().sort({
      createdAt: -1,
    });

    res.json(reviews);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};
// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    // Only the review owner or an admin can delete it
    if (
      review.userId !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      message: "Review deleted"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getAllReviews,
  getReviews,
  addReview,
  deleteReview,
};