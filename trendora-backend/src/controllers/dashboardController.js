const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

// DASHBOARD SUMMARY
const getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const outOfStockProducts = await Product.countDocuments({
      inStock: false
    });

    const pendingOrders = await Order.countDocuments({
      orderStatus: "Pending"
    });

    const deliveredOrders = await Order.countDocuments({
      orderStatus: "Delivered"
    });

    const orders = await Order.find();

    let totalRevenue = 0;

    orders.forEach(order => {
      totalRevenue += order.totalAmount || 0;
    });

    res.json({
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      outOfStockProducts
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// MONTHLY SALES
const getMonthlySales = async (req, res) => {
  try {

    const sales = await Order.aggregate([
      {
        $match: {
          orderStatus: {
            $ne: "Cancelled"
          }
        }
      },
      {
        $group: {
          _id: {
            year: {
              $year: "$createdAt"
            },
            month: {
              $month: "$createdAt"
            }
          },
          totalSales: {
            $sum: "$totalAmount"
          },
          totalOrders: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    const months = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const result = sales.map(item => ({
      year: item._id.year,
      month: months[item._id.month],
      totalSales: item.totalSales,
      totalOrders: item.totalOrders
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// ORDER STATUS ANALYTICS
const getOrderStatusAnalytics = async (req, res) => {
  try {

    const status = await Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: {
            $sum: 1
          }
        }
      }
    ]);

    res.json(status);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
console.log({
  getDashboard,
  getMonthlySales,
  getOrderStatusAnalytics,
});
module.exports = {
  getDashboard,
  getMonthlySales,
  getOrderStatusAnalytics
};