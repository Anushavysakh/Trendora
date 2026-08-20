import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Chip,
  Button,
  Divider,
  Container,
  Paper,
} from "@mui/material";

import api from "../../services/api";
import UserLayout from "../../layouts/UserLayout";

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders");

      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "success";

      case "Cancelled":
        return "error";

      case "Shipped":
        return "info";

      case "Processing":
        return "warning";

      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
        >
          <CircularProgress sx={{ color: "#FFA41C" }} />
        </Box>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <Box
        sx={{
          bgcolor: "#f7f7f7",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Container maxWidth="lg">
          {/* HEADER */}

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: "#0f1111",
              mb: 1,
            }}
          >
            My Orders
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#565959",
              mb: 4,
            }}
          >
            View and track all your orders
          </Typography>

          {/* NO ORDERS */}

          {orders.length === 0 ? (
            <Paper
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                mb={1}
              >
                You have no orders yet
              </Typography>

              <Typography
                color="text.secondary"
                mb={3}
              >
                Start shopping and your orders will appear here.
              </Typography>

              <Button
                variant="contained"
                onClick={() => navigate("/")}
                sx={{
                  bgcolor: "#FFD814",
                  color: "#0f1111",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#F7CA00",
                  },
                }}
              >
                Start Shopping
              </Button>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {orders.map((order) => (
                <Card
                  key={order._id}
                  elevation={0}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    bgcolor: "#fff",
                  }}
                >
                  {/* ORDER HEADER */}

                  <Box
                    sx={{
                      bgcolor: "#f6f6f6",
                      p: 2,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: {
                        xs: "flex-start",
                        sm: "center",
                      },
                      flexDirection: {
                        xs: "column",
                        sm: "row",
                      },
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        ORDER PLACED
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        ORDER ID
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        #{order._id}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        TOTAL
                      </Typography>

                      <Typography
                        variant="body2"
                        fontWeight={700}
                      >
                        ₹{order.totalAmount?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  {/* ORDER ITEMS */}

                  <CardContent>
                    {order.items?.map((item, index) => (
                      <Box key={index}>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            py: 2,
                          }}
                        >
                          {/* PRODUCT IMAGE */}

                          <CardMedia
                            component="img"
                            image={item.image}
                            alt={item.name}
                            sx={{
                              width: 100,
                              height: 100,
                              objectFit: "contain",
                              bgcolor: "#f7f7f7",
                              borderRadius: 1,
                            }}
                          />

                          {/* PRODUCT INFO */}

                          <Box
                            sx={{
                              flexGrow: 1,
                            }}
                          >
                            <Typography
                              variant="body1"
                              fontWeight={600}
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {item.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.5,
                              }}
                            >
                              Quantity: {item.quantity}
                            </Typography>

                            <Typography
                              variant="body1"
                              fontWeight={700}
                              sx={{
                                mt: 0.5,
                              }}
                            >
                              ₹{item.price?.toLocaleString()}
                            </Typography>
                          </Box>

                          {/* VIEW PRODUCT */}

                          {item.product && (
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                navigate(
                                  `/product/${item.product}`
                                )
                              }
                              sx={{
                                textTransform: "none",
                                borderColor: "#aaa",
                                color: "#333",
                              }}
                            >
                              View Product
                            </Button>
                          )}
                        </Box>

                        {index !== order.items.length - 1 && (
                          <Divider />
                        )}
                      </Box>
                    ))}

                    {/* ORDER STATUS */}

                    <Box
                      sx={{
                        mt: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexWrap: "wrap",
                      }}
                    >
                      <Typography
                        variant="body2"
                        fontWeight={600}
                      >
                        Order Status:
                      </Typography>

                      <Chip
                        label={order.orderStatus}
                        color={getStatusColor(
                          order.orderStatus
                        )}
                        size="small"
                      />

                      <Typography
                        variant="body2"
                        fontWeight={600}
                        sx={{
                          ml: {
                            xs: 0,
                            sm: 2,
                          },
                        }}
                      >
                        Payment:
                      </Typography>

                      <Chip
                        label={order.paymentStatus}
                        color={
                          order.paymentStatus === "Paid"
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </Box>

                    {/* SHIPPING ADDRESS */}

                    {order.shippingAddress && (
                      <Box
                        sx={{
                          mt: 3,
                          p: 2,
                          bgcolor: "#fafafa",
                          borderRadius: 1,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          mb={0.5}
                        >
                          Delivery Address
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {order.shippingAddress.fullName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {order.shippingAddress.address}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {order.shippingAddress.city},{" "}
                          {order.shippingAddress.state} -{" "}
                          {order.shippingAddress.pincode}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Phone: {order.shippingAddress.phone}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </UserLayout>
  );
}

export default MyOrders;