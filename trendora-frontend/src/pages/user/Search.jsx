import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import api from "../../services/api";
import UserLayout from "../../layouts/UserLayout";

function Search() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const [searchText, setSearchText] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSearchText(query);

    if (!query.trim()) {
      setProducts([]);
      return;
    }

    searchProducts(query);
  }, [query]);

  const searchProducts = async (searchQuery) => {
    try {
      setLoading(true);

      const response = await api.get(
        `/products/search?q=${encodeURIComponent(searchQuery)}`
      );

      console.log("SEARCH RESPONSE:", response.data);

      // Important: adjust this according to your API response
      setProducts(
        response.data.products ||
        response.data.data ||
        response.data ||
        []
      );

    } catch (error) {
      console.error("Search error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 2, md: 4 },
          py: 4,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={600}
          mb={3}
        >
          Search Products
        </Typography>

        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchText.trim()) {
              window.history.pushState(
                {},
                "",
                `/search?q=${encodeURIComponent(searchText)}`
              );

              window.location.reload();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading && (
          <Box
            display="flex"
            justifyContent="center"
            mt={5}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && query && products.length === 0 && (
          <Typography
            textAlign="center"
            mt={6}
            color="text.secondary"
          >
            No products found for "{query}"
          </Typography>
        )}

        {!loading && products.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 3,
              mt: 4,
            }}
          >
            {products.map((product) => (
              <Box
                key={product._id}
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: 220,
                    objectFit: "contain",
                  }}
                />

                <Typography
                  fontWeight={600}
                  mt={1}
                >
                  {product.name}
                </Typography>

                <Typography>
                  ₹{product.price}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </UserLayout>
  );
}

export default Search;