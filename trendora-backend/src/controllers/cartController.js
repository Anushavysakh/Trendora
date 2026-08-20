const Cart = require("../models/Cart");

// GET CART
const getCart = async (req, res) => {
  try {

    const userId = req.user._id;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        userId,
        items: []
      });
    }

    res.json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ADD TO CART
const addToCart = async (req, res) => {
  try {

    const userId = req.user._id;

    const {
      productId,
      name,
      image,
      price,
      qty
    } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: []
      });
    }

    const existingItem = cart.items.find(
      item => item.productId === productId
    );

    if (existingItem) {
      existingItem.qty += qty || 1;
    } else {
      cart.items.push({
        productId,
        name,
        image,
        price,
        qty: qty || 1
      });
    }

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// UPDATE QUANTITY
const updateQty = async (req, res) => {
  try {

    const userId = req.user._id;

    const {
      productId,
      qty
    } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    const item = cart.items.find(
      item => item.productId === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found"
      });
    }

    item.qty = qty;

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// REMOVE ITEM
const removeFromCart = async (req, res) => {
  try {

    const userId = req.user._id;

    const { productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found"
      });
    }

    cart.items = cart.items.filter(
      item => item.productId !== productId
    );

    await cart.save();

    res.status(200).json(cart);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQty,
  removeFromCart
};