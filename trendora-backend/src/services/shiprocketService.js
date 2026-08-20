const axios = require("axios");

const SHIPROCKET_BASE_URL =
  "https://apiv2.shiprocket.in/v1/external";

let shiprocketToken = null;
let tokenExpiry = null;


// Get Shiprocket token
const getShiprocketToken = async () => {
  try {
    // Reuse token if still valid
    if (
      shiprocketToken &&
      tokenExpiry &&
      Date.now() < tokenExpiry
    ) {
      return shiprocketToken;
    }

    const response = await axios.post(
      `${SHIPROCKET_BASE_URL}/auth/login`,
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD,
      }
    );

    shiprocketToken = response.data.token;

    // Token validity: approximately 10 days
    // Refresh a little before expiration
    tokenExpiry =
      Date.now() + 9 * 24 * 60 * 60 * 1000;

    return shiprocketToken;

  } catch (error) {
    console.error(
      "Shiprocket authentication error:",
      error.response?.data || error.message
    );

    throw new Error(
      "Unable to authenticate with Shiprocket"
    );
  }
};


// Check shipping rates
const getShippingRates = async ({
  deliveryPostcode,
  weight,
  cod = 0,
  length,
  breadth,
  height,
  declaredValue,
}) => {
  try {
    const token = await getShiprocketToken();

    const params = {
      pickup_postcode:
        process.env.SHIPROCKET_PICKUP_PINCODE,

      delivery_postcode:
        deliveryPostcode,

      cod,

      weight,

      declared_value:
        declaredValue,
    };

    // Add dimensions only if available
    if (length) {
      params.length = length;
    }

    if (breadth) {
      params.breadth = breadth;
    }

    if (height) {
      params.height = height;
    }

    const response = await axios.get(
      `${SHIPROCKET_BASE_URL}/courier/serviceability/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    return response.data;

  } catch (error) {
    console.error(
      "Shiprocket rate error:",
      error.response?.data || error.message
    );

    throw new Error(
      "Unable to calculate shipping charges"
    );
  }
};


module.exports = {
  getShiprocketToken,
  getShippingRates,
};