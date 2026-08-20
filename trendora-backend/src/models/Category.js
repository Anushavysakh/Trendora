const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  usertype: [{
    type: String
  }],

  category: {
    type: String,
    required: true
  },

  subCategories: [{
    type: String
  }]
});

module.exports = mongoose.model("Category", categorySchema);