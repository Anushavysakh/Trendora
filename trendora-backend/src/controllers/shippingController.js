const {
  getShippingRates,
} = require("../services/shiprocketService");

const calculateShipping = async (req, res) => {
  try {
    const {
      deliveryPostcode,
      weight,
      cod = 0,
      declaredValue,
    } = req.body;

    if (!deliveryPostcode) {
      return res.status(400).json({
        message: "Delivery pincode is required",
      });
    }

    if (!weight || Number(weight) <= 0) {
      return res.status(400).json({
        message: "Valid shipment weight is required",
      });
    }

    const rates = await getShippingRates({
      deliveryPostcode,
      weight: Number(weight),
      cod: Number(cod),
      declaredValue: Number(declaredValue || 0),
    });

    res.json({
      success: true,
      data: rates,
    });

  } catch (error) {
    console.error(
      "Calculate shipping error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  calculateShipping,
};