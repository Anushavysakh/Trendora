import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

function Checkout() {
  const navigate = useNavigate();

  const { cartItems,
    totalPrice,
    totalWeightGrams,
    totalWeightKg,
    clearCart } = useCart();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [pincodeVerified, setPincodeVerified] = useState(false);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiPaymentCompleted, setUpiPaymentCompleted] = useState(false);

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const orderTotal =
    totalPrice + (shippingCharge || 0);
  const upiLink =
    `upi://pay?pa=7025089034@apl&pn=Trendora&am=${orderTotal}&cu=INR`;
  // HANDLE INPUT CHANGES
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "pincode") {
      setPincodeVerified(false);
    }
  };

  // VERIFY PINCODE
  const verifyPincode = async () => {
    const pincode = form.pincode.trim();

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      alert("Please enter a valid 6-digit Indian pincode.");
      setPincodeVerified(false);
      return;
    }

    await calculateShippingCharge(pincode);
  };


 const calculateShippingCharge = async () => {
  try {
    setShippingLoading(true);

    const response = await api.post(
      "/shipping/calculate",
      {
        deliveryPostcode: form.pincode,
        weight: totalWeightKg,
        cod: 0,
        declaredValue: totalPrice,
      }
    );

    console.log(
      "Shiprocket response:",
      response.data
    );

    const availableCouriers =
      response.data
        ?.data
        ?.data
        ?.available_courier_companies || [];

    if (availableCouriers.length === 0) {
      alert(
        "No courier is available for this pincode."
      );

      setShippingCharge(null);
      setPincodeVerified(false);

      return;
    }

    // Prefer Delhivery for India
    const delhiveryCourier =
      availableCouriers.find(
        (courier) =>
          courier.courier_name
            ?.toLowerCase()
            .includes("delhivery")
      );

    const selectedCourier =
      delhiveryCourier ||
      availableCouriers[0];

    setShippingCharge(
      Number(selectedCourier.rate)
    );

    setPincodeVerified(true);

    alert(
      `Delivery available.\n` +
      `Courier: ${selectedCourier.courier_name}\n` +
      `Shipping charge: ₹${selectedCourier.rate}`
    );

  } catch (error) {
    console.error(
      "Shipping calculation error:",
      error
    );

    setShippingCharge(null);
    setPincodeVerified(false);

    alert(
      error.response?.data?.message ||
      "Unable to calculate shipping"
    );

  } finally {
    setShippingLoading(false);
  }
};

  // LOAD RAZORPAY SCRIPT
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);

      document.body.appendChild(script);
    });
  };

  // VALIDATE CHECKOUT FORM
  const validateForm = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return false;
    }

    if (
      !form.fullName.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    ) {
      alert("Please fill all shipping details.");
      return false;
    }

    if (!/^[6-9][0-9]{9}$/.test(form.phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return false;
    }

    if (!/^[1-9][0-9]{5}$/.test(form.pincode)) {
      alert("Please enter a valid 6-digit Indian pincode.");
      return false;
    }

    if (!pincodeVerified) {
      alert("Please verify your pincode before payment.");
      return false;
    }

    return true;
  };

  // CREATE ORDER DATA
  const getOrderData = () => {
    return {
      items: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        weight: item.weight,
      })),

      shippingAddress: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },

      totalWeight: totalWeightGrams,

      totalAmount: orderTotal,

      shippingCharge,

      paymentMethod,
    };
  };

  // UPI PAYMENT
  const handleUPIPayment = async () => {
    if (!upiPaymentCompleted) {
      alert(
        "Please complete the UPI payment using the QR code and confirm the payment."
      );
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        ...getOrderData(),
        paymentStatus: "Pending",
        orderStatus: "Pending",
      };

      await api.post("/orders", orderData);

      alert(
        "Order placed successfully. Your UPI payment will be verified."
      );

      clearCart();
      navigate("/orders");
    } catch (error) {
      console.error("UPI order error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to place UPI order."
      );
    } finally {
      setLoading(false);
    }
  };

  // RAZORPAY PAYMENT
  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);

      const scriptLoaded = await loadRazorpayScript();

      if (!scriptLoaded) {
        alert("Razorpay failed to load.");
        setLoading(false);
        return;
      }

      const response = await api.post(
        "/payments/create-order",
        {
          amount: orderTotal,
        }
      );

      const { order, key } = response.data;

      const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "Trendora",
        description: "Trendora Order Payment",
        order_id: order.id,

        handler: async function (paymentResponse) {
          try {
            const orderData = {
              razorpay_order_id:
                paymentResponse.razorpay_order_id,

              razorpay_payment_id:
                paymentResponse.razorpay_payment_id,

              razorpay_signature:
                paymentResponse.razorpay_signature,

              ...getOrderData(),
            };

            const verifyResponse = await api.post(
              "/payments/verify",
              orderData
            );

            if (verifyResponse.data.success) {
              alert(
                "Payment successful! Order placed."
              );

              clearCart();
              navigate("/orders");
            }
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            alert(
              error.response?.data?.message ||
              "Payment verification failed."
            );
          }
        },

        prefill: {
          name: form.fullName || user?.name || "",
          email: user?.email || "",
          contact: form.phone,
        },

        theme: {
          color: "#C8A74E",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);

      alert(
        error.response?.data?.message ||
        "Payment failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // MAIN PAYMENT HANDLER
  const handlePayment = () => {
    if (!validateForm()) {
      return;
    }

    if (paymentMethod === "UPI") {
      handleUPIPayment();
      return;
    }

    if (paymentMethod === "RAZORPAY") {
      handleRazorpayPayment();
      return;
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#fcfcfc",
        minHeight: "100vh",
        py: 4,
        px: {
          xs: 2,
          md: 6,
        },
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
        }}
      >
        <Typography
          variant="h5"
          fontWeight={500}
          sx={{
            mb: 4,
            fontSize: "28px",
            color: "#0f1111",
          }}
        >
          Review Your Order & Checkout
        </Typography>

        <Grid container spacing={4}>

          {/* LEFT SIDE */}
          <Grid item xs={12} md={7}>
            <Box
              display="flex"
              flexDirection="column"
              gap={3}
            >

              {/* SHIPPING ADDRESS */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid #ddd",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    fontSize: "18px",
                    mb: 2.5,
                    color: "#0f1111",
                  }}
                >
                  1. Shipping Address
                </Typography>

                <Grid container spacing={2}>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Full Name"
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Phone Number"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      label="Flat, House no., Building, Company, Apartment, Street"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="City"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="State"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box
                      display="flex"
                      gap={1}
                      alignItems="flex-start"
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label="Pincode"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        inputProps={{
                          maxLength: 6,
                        }}
                      />

                      <Button
                        variant="outlined"
                        onClick={verifyPincode}
                        disabled={
                          form.pincode.length !== 6 ||
                          pincodeVerified
                        }
                        sx={{
                          height: 40,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {pincodeVerified
                          ? "Verified"
                          : "Verify"}
                      </Button>
                    </Box>

                    {pincodeVerified && (
                      <Typography
                        color="green"
                        mt={1}
                      >
                        ✓ Pincode verified
                      </Typography>
                    )}
                  </Grid>

                </Grid>
              </Paper>

              {/* PAYMENT METHOD */}
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  mb={2}
                >
                  2. Payment Method
                </Typography>

                <FormControl fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => {
                      setPaymentMethod(e.target.value);
                      setUpiPaymentCompleted(false);
                    }}
                  >
                    <FormControlLabel
                      value="UPI"
                      control={<Radio />}
                      label="UPI Payment"
                    />

                    <FormControlLabel
                      value="RAZORPAY"
                      control={<Radio />}
                      label="Razorpay - Card, Wallet, Net Banking & More"
                    />
                  </RadioGroup>
                </FormControl>

                {/* UPI PAYMENT */}
                {paymentMethod === "UPI" && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 3,
                      bgcolor: "#fafafa",
                      border: "1px solid #C8A74E",
                      borderRadius: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      fontWeight={700}
                      mb={1}
                    >
                      Secure UPI Payment
                    </Typography>

                    <Typography
                      color="text.secondary"
                      mb={2}
                    >
                      Scan the QR code using any UPI app.
                    </Typography>

                    <QRCodeSVG
                      value={upiLink}
                      size={280}
                    />

                    <Typography
                      mt={2}
                      fontWeight={600}
                    >
                      Amount to Pay: ₹{orderTotal}
                    </Typography>

                    <Button
                      variant={
                        upiPaymentCompleted
                          ? "contained"
                          : "outlined"
                      }
                      color={
                        upiPaymentCompleted
                          ? "success"
                          : "primary"
                      }
                      sx={{
                        mt: 2,
                      }}
                      onClick={() =>
                        setUpiPaymentCompleted(
                          !upiPaymentCompleted
                        )
                      }
                    >
                      {upiPaymentCompleted
                        ? "✓ Payment Completed"
                        : "I Have Completed Payment"}
                    </Button>
                  </Box>
                )}
              </Paper>
            </Box>
          </Grid>

          {/* RIGHT SIDE */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid #ddd",
                borderRadius: 2,
                position: "sticky",
                top: 24,
                bgcolor: "#f3f3f3",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{
                  fontSize: "18px",
                  mb: 2,
                  color: "#0f1111",
                }}
              >
                Order Summary
              </Typography>

              <Box
                sx={{
                  maxHeight: 300,
                  overflowY: "auto",
                  pr: 0.5,
                  mb: 1,
                }}
              >
                {cartItems.map((item) => (
                  <Box
                    key={item._id}
                    sx={{
                      display: "flex",
                      mb: 2,
                      gap: 2,
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component="img"
                      src={item.image}
                      sx={{
                        width: 55,
                        height: 55,
                        objectFit: "contain",
                        borderRadius: 1,
                        bgcolor: "#fff",
                        border: "1px solid #e2e2e2",
                        p: 0.5,
                      }}
                    />

                    <Box flex={1}>
                      <Typography
                        fontWeight={500}
                        sx={{
                          fontSize: "14px",
                          color: "#0f1111",
                        }}
                        noWrap
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          fontSize: "12px",
                        }}
                      >
                        Qty: {item.quantity}
                      </Typography>
                    </Box>

                    <Typography
                      fontWeight={500}
                      sx={{
                        fontSize: "14px",
                        color: "#0f1111",
                      }}
                    >
                      ₹{item.price * item.quantity}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Divider
                sx={{
                  my: 2,
                  borderColor: "#ddd",
                }}
              />

              <Box
                display="flex"
                justifyContent="space-between"
                mb={1}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Items Subtotal:
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#0f1111",
                  }}
                >
                  ₹{totalPrice}
                </Typography>
              </Box>

              <Box
                display="flex"
                justifyContent="space-between"
                mb={2}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Shipping & Handling:
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: shippingCharge > 0 ? "#0f1111" : "green",
                  }}
                >
                  {shippingLoading
                    ? "Calculating..."
                    : pincodeVerified
                      ? `₹${shippingCharge}`
                      : "Enter pincode"}
                </Typography>
              </Box>

              <Divider
                sx={{
                  my: 1.5,
                  borderColor: "#ddd",
                }}
              />

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="baseline"
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    color: "#B12704",
                  }}
                >
                  Order Total:
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    color: "#B12704",
                  }}
                >
                  ₹{orderTotal}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                onClick={handlePayment}
                disabled={
                  loading ||
                  cartItems.length === 0
                }
                sx={{
                  mt: 4,
                  bgcolor: "#C8A74E",
                  py: 1.5,
                  fontWeight: "bold",

                  "&:hover": {
                    bgcolor: "#b6922a",
                  },
                }}
              >
                {loading
                  ? "Processing..."
                  : paymentMethod === "UPI"
                    ? "Place UPI Order"
                    : "Pay with Razorpay"}
              </Button>

              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                sx={{
                  textAlign: "center",
                  mt: 2,
                  lineHeight: 1.2,
                }}
              >
                By placing your order, you agree to Trendora's terms of use and privacy notice.
              </Typography>
            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}

export default Checkout;