const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
{
  productId: {
    type: String,
    required: true
  },

  userId: {
    type: String,
    required: true
  },

  userName: {
    type: String,
    required: true
  },

  rating: {
    type: Number,
    required: true
  },

  comment: {
    type: String,
    required: true
  }
},
{
  timestamps: true
});

module.exports = mongoose.model("Review", reviewSchema);