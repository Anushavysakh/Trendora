import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Container,
} from "@mui/material";
import ProductCard from "../common/ProductCard";

function FeaturedProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await api.get("/products", {
        params: {
          limit: 8,
        },
      });

      setProducts(res.data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
        <CircularProgress sx={{ color: "#FFD700" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, bgcolor: "#fafafa" }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          align="center"
          fontWeight="bold"
          mb={1}
          sx={{ color: "#FFD700" }}
        >
          Featured Products
        </Typography>

        <Typography align="center" color="text.secondary" mb={6}>
          Discover our latest collection
        </Typography>

        <Grid container spacing={1} sx={{ alignItems: "stretch" }}>
          {products.map((product) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={product._id || product.id}
              sx={{ display: "flex" }}
            >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturedProducts;