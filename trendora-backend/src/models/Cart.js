const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
{
  userId: {
    type: String,
    required: true
  },

  items: [
    {
      productId: String,
      name: String,
      image: String,
      price: Number,
      qty: {
        type: Number,
        default: 1
      }
    }
  ]
},
{
  timestamps: true
});

module.exports = mongoose.model("Cart", cartSchema);