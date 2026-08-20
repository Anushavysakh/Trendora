const Wishlist = require("../models/Wishlist");


// GET WISHLIST
const getWishlist = async (req, res) => {
  try {

    const userId = req.user.id;
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.json({
        userId,
        items: []
      });
    }

    res.json(wishlist);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ADD TO WISHLIST
const addToWishlist = async (req, res) => {
  try {
    const {
      productId,
      image,
      name,
      price
    } = req.body;

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        items: []
      });
    }

    const exists = wishlist.items.find(
      item => item.productId === productId
    );

    if (!exists) {
      wishlist.items.push({
        productId,
        name,
        image,
        price
      });
    }

    await wishlist.save();

    res.json(wishlist);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// REMOVE FROM WISHLIST
const removeFromWishlist = async (req, res) => {
  try {

    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found"
      });
    }

    wishlist.items = wishlist.items.filter(
      item => item.productId !== productId
    );

    await wishlist.save();

    res.json(wishlist);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};