const crypto = require("crypto");
const razorpay = require("../config/razorpay");
const Product = require("../models/Product");
const Order = require("../models/Order");

// CREATE RAZORPAY ORDER
const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Invalid payment amount",
      });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `trendora_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Create Payment Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// VERIFY PAYMENT AND CREATE ORDER
const verifyPayment = async (req, res) => {
  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      items,
      shippingAddress,
      totalAmount,
    } = req.body;


    // CREATE SIGNATURE
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        razorpay_order_id +
        "|" +
        razorpay_payment_id
      )
      .digest("hex");


    // VERIFY SIGNATURE
    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }


    // CHECK STOCK BEFORE CREATING ORDER

    for (const item of items) {

      const product = await Product.findById(
        item.product
      );

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      if (product.count < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

    }


    // CREATE ORDER

    const order = await Order.create({

      user: req.user.id,

      items,

      shippingAddress,

      totalAmount,

      paymentMethod: "UPI",

      paymentStatus: "Paid",

      orderStatus: "Processing",

      razorpayOrderId: razorpay_order_id,

      razorpayPaymentId: razorpay_payment_id,

    });


    // REDUCE STOCK

    for (const item of items) {

      const product = await Product.findById(
        item.product
      );

      product.count -= item.quantity;

      product.inStock =
        product.count > 0;

      await product.save();

    }


    res.status(201).json({

      success: true,

      message: "Payment verified and order created",

      order,

    });


  } catch (error) {

    console.error(
      "Payment Verification Error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });

  }
};


module.exports = {

  createPaymentOrder,

  verifyPayment,

};