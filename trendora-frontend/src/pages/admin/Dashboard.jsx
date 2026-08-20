import { useEffect, useState } from "react";

import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

import api from "../../services/api";

function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const [
        productsResponse,
        ordersResponse,
        usersResponse,
      ] = await Promise.all([
        api.get("/products"),
        api.get("/orders"),
        api.get("/users"),
      ]);

      console.log(
        "Products response:",
        productsResponse.data
      );

      console.log(
        "Orders response:",
        ordersResponse.data
      );

      console.log(
        "Users response:",
        usersResponse.data
      );

      // Handle different API response formats

      const products =
        Array.isArray(productsResponse.data)
          ? productsResponse.data
          : productsResponse.data.products || [];

      const orders =
        Array.isArray(ordersResponse.data)
          ? ordersResponse.data
          : ordersResponse.data.orders || [];

      const users =
        Array.isArray(usersResponse.data)
          ? usersResponse.data
          : usersResponse.data.users || [];

      // Calculate revenue

      const revenue = orders.reduce(
        (total, order) =>
          total + Number(order.totalAmount || 0),
        0
      );

      console.log(
        "Products count:",
        products.length
      );

      console.log(
        "Orders count:",
        orders.length
      );

      console.log(
        "User count:",
        users.length
      );

      console.log(
        "Revenue:",
        revenue
      );

      setStats({
        products: products.length,
        orders: orders.length,
        users: users.length,
        revenue,
      });

    } catch (error) {
      console.error(
        "Failed to fetch dashboard statistics:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Products",
      count: stats.products,
    },
    {
      title: "Orders",
      count: stats.orders,
    },
    {
      title: "Users",
      count: stats.users,
    },
    {
      title: "Revenue",
      count: `₹${stats.revenue}`,
    },
  ];

  return (
    <Box
      sx={{
        background: "#f7f7f7",
        minHeight: "100vh",
        p: 4,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        Trendora Admin Dashboard
      </Typography>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            key={card.title}
          >
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">
                {card.title}
              </Typography>

              {loading ? (
                <CircularProgress
                  size={28}
                  sx={{ mt: 2 }}
                />
              ) : (
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  mt={1}
                >
                  {card.count}
                </Typography>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default Dashboard;