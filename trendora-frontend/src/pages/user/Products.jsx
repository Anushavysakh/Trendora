// Products.jsx

import { useEffect, useState } from "react";
import api from "../../services/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import UserLayout from "../../layouts/UserLayout";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import {
  Box,
  Typography,
  Grid,
  Paper,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Container,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";

function Products() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { cartItems, addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Get cart item
  const getCartItem = (productId) => {
    return cartItems.find((item) => item._id === productId);
  };

  // URL parameters
  const usertype = searchParams.get("usertype");
  const initialCategory = searchParams.get("category") || "";
  const initialSubCategory = searchParams.get("subCategory") || "";

  // States
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(initialSubCategory);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories", {
          params: { usertype },
        });

        const normalized = res.data.map((cat) => ({
          ...cat,
          category: cat.category?.trim(),
          subCategories: cat.subCategories?.map((sub) => sub.trim()) || [],
        }));

        setCategories(normalized);

        if (initialCategory) {
          const matched = normalized.find(
            (cat) => cat.category === initialCategory.trim()
          );

          if (matched) {
            setSelectedCategory(matched.category);
            setSubCategories(matched.subCategories);
          }
        }
      } catch (error) {
        console.log("Category fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [usertype, initialCategory]);

  // Fetch all products for user type
  const fetchProductsByUsertype = async () => {
    try {
      setProductsLoading(true);
      const res = await api.get("/products", {
        params: { usertype },
      });
      setProducts(res.data.products || []);
    } catch (error) {
      console.log("Product fetch error:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  // Initial product fetch
  useEffect(() => {
    if (!loading && usertype) {
      fetchProductsByUsertype();
    }
  }, [loading, usertype]);

  // Fetch products by subcategory
  const fetchProducts = async (sub, category = selectedCategory) => {
    try {
      setProductsLoading(true);
      setSelectedSubCategory(sub);

      navigate(
        `/products?usertype=${encodeURIComponent(
          usertype
        )}&category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(
          sub
        )}`,
        { replace: true }
      );

      setProducts([]);

      const res = await api.get("/products", {
        params: {
          usertype,
          category,
          subCategory: sub,
        },
      });

      setProducts(res.data.products || []);
    } catch (error) {
      console.log("Product fetch error:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
        <CircularProgress sx={{ color: "#FFA41C" }} />
      </Box>
    );
  }

  return (
    <UserLayout>
      <Box sx={{ bgcolor: "#fff", minHeight: "100vh", py: 3 }}>
        <Container maxWidth="xl">
          {/* HEADER */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              borderBottom: "1px solid #e7e7e7",
              pb: 2,
            }}
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ textTransform: "capitalize", color: "#0f1111" }}
              >
                {usertype || "Shop Collection"}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                Discover trending items curated just for you
              </Typography>
            </Box>
          </Box>

          {/* MAIN LAYOUT */}
          <Grid container spacing={3}>
            {/* SIDEBAR */}
            <Grid item xs={12} sm={4} md={3} lg={2.5}>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #e7e7e7",
                  borderRadius: 2,
                  bgcolor: "#fff",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, color: "#0f1111" }}>
                  Department
                </Typography>

                <List disablePadding dense>
                  {categories.map((cat) => {
                    const isCatSelected = selectedCategory === cat.category;

                    return (
                      <Box key={cat._id} sx={{ mb: 0.5 }}>
                        <ListItemButton
                          dense
                          onClick={() => {
                            const firstSubCategory = cat.subCategories[0];
                            setSelectedCategory(cat.category);
                            setSubCategories(cat.subCategories);
                            setSelectedSubCategory(firstSubCategory || "");
                            setProducts([]);

                            if (firstSubCategory) {
                              fetchProducts(firstSubCategory, cat.category);
                            } else {
                              navigate(
                                `/products?usertype=${encodeURIComponent(
                                  usertype
                                )}&category=${encodeURIComponent(cat.category)}`
                              );
                            }
                          }}
                          sx={{
                            borderRadius: 1,
                            py: 0.5,
                            px: 1,
                            bgcolor: isCatSelected ? "#f0f2f2" : "transparent",
                          }}
                        >
                          <ListItemText
                            primary={cat.category}
                            primaryTypographyProps={{
                              fontSize: "13px",
                              fontWeight: isCatSelected ? 700 : 400,
                              color: isCatSelected ? "#0f1111" : "#333",
                            }}
                          />
                        </ListItemButton>

                        {isCatSelected && subCategories.length > 0 && (
                          <List dense disablePadding sx={{ pl: 2, mt: 0.5, mb: 1 }}>
                            {subCategories.map((sub) => {
                              const isSubSelected = selectedSubCategory === sub;

                              return (
                                <ListItemButton
                                  key={sub}
                                  dense
                                  onClick={() => fetchProducts(sub, cat.category)}
                                  sx={{
                                    borderRadius: 1,
                                    py: 0.25,
                                    my: 0.2,
                                  }}
                                >
                                  <ListItemText
                                    primary={sub}
                                    primaryTypographyProps={{
                                      fontSize: "12px",
                                      fontWeight: isSubSelected ? 700 : 400,
                                      color: isSubSelected ? "#B12704" : "#565959",
                                    }}
                                  />
                                </ListItemButton>
                              );
                            })}
                          </List>
                        )}
                      </Box>
                    );
                  })}
                </List>
              </Paper>
            </Grid>

            {/* PRODUCTS AREA */}
            <Grid item xs={12} sm={8} md={9} lg={9.5}>
              {productsLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="350px">
                  <CircularProgress sx={{ color: "#FFA41C" }} />
                </Box>
              ) : products.length === 0 ? (
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: "center",
                    border: "1px solid #ddd",
                    borderRadius: 2,
                  }}
                >
                  <Typography color="text.secondary">No products found.</Typography>
                </Paper>
              ) : (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: "#565959" }}>
                      Showing products for{" "}
                      <span style={{ fontWeight: 700, color: "#0f1111" }}>
                        "{usertype}"
                      </span>
                      {` (${products.length} items)`}
                    </Typography>
                  </Box>

                  {/* STRICT CSS GRID: PREVENTS SHRINKING OR RESIZING */}
                  <Box
                    sx={{
                      display: "grid",

                      // Responsive product columns
                      gridTemplateColumns: {
                        xs: "repeat(2, minmax(0, 1fr))",
                        sm: "repeat(3, minmax(0, 1fr))",
                        md: "repeat(3, minmax(0, 1fr))",
                        lg: "repeat(4, minmax(0, 1fr))",
                        xl: "repeat(5, minmax(0, 1fr))",
                      },

                      gap: 2,

                      width: "100%",
                    }}
                  >
                    {products.map((product) => {
                      const hasDiscount = product.mrp > product.price;
                      const discountPercentage = hasDiscount
                        ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                        : 0;
                      const isAdded = getCartItem(product._id);
                      const isLiked = isInWishlist(product._id);

                      return (
                        <Card
                          key={product._id}
                          onClick={() => navigate(`/product/${product._id}`)}
                          elevation={0}
                          sx={{
                            width: "220px", // FIXED WIDTH PER CARD
                            height: "360px", // FIXED HEIGHT PER CARD
                            display: "flex",
                            flexDirection: "column",
                            border: "none",
                            borderRadius: 1,
                            position: "relative",
                            cursor: "pointer",
                            bgcolor: "#fff",
                            boxSizing: "border-box",
                            transition: "opacity 0.15s ease-in-out",
                            "&:hover": {
                              opacity: 0.92,
                            },
                          }}
                        >
                          {/* FIXED IMAGE BOX (220px x 220px) */}
                          <Box
                            sx={{
                              width: "220px",
                              height: "220px",
                              position: "relative",
                              bgcolor: "#f7f7f7",
                              borderRadius: 1.5,
                              overflow: "hidden",
                              flexShrink: 0,
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={product.image}
                              alt={product.name}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />

                            {/* WISHLIST BUTTON */}
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                isLiked
                                  ? removeFromWishlist(product._id)
                                  : addToWishlist(product);
                              }}
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                bgcolor: "rgba(255, 255, 255, 0.85)",
                                backdropFilter: "blur(2px)",
                                p: "5px",
                                "&:hover": { bgcolor: "#fff" },
                              }}
                            >
                              {isLiked ? (
                                <FavoriteIcon fontSize="small" sx={{ color: "#CC0C39", fontSize: "18px" }} />
                              ) : (
                                <FavoriteBorderIcon fontSize="small" sx={{ color: "#333", fontSize: "18px" }} />
                              )}
                            </IconButton>


                          </Box>

                          {/* DETAILS SECTION */}
                          <CardContent
                            sx={{
                              p: "8px 2px",
                              flexGrow: 1,
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                              "&:last-child": { pb: "8px" },
                            }}
                          >
                            <Box>
                              {/* BADGES */}
                              {hasDiscount && (
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                  <Chip
                                    label={`${discountPercentage}% off`}
                                    size="small"
                                    sx={{
                                      bgcolor: "#CC0C39",
                                      color: "#fff",
                                      fontWeight: 700,
                                      fontSize: "11px",
                                      height: "18px",
                                      borderRadius: "2px",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "#CC0C39",
                                      fontWeight: 700,
                                      fontSize: "11px",
                                    }}
                                  >
                                    Limited time deal
                                  </Typography>
                                </Box>
                              )}

                              {/* PRICE ROW */}
                              <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75, my: 0.25 }}>
                                <Typography
                                  variant="body1"
                                  fontWeight={700}
                                  sx={{ color: "#0f1111", fontSize: "1.05rem", lineHeight: 1.2 }}
                                >
                                  ₹{product.price?.toLocaleString()}
                                </Typography>

                                {hasDiscount && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "#565959",
                                      textDecoration: "line-through",
                                      fontSize: "11px",
                                    }}
                                  >
                                    M.R.P: ₹{product.mrp?.toLocaleString()}
                                  </Typography>
                                )}
                              </Box>

                              {/* TITLE (LOCKED TO 2 LINES) */}
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#0f1111",
                                  fontSize: "13px",
                                  lineHeight: 1.3,
                                  height: "2.6em",
                                  maxHeight: "2.6em",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  mt: 0.5,
                                }}
                              >
                                {product.name}
                              </Typography>
                            </Box>

                            {/* ADD TO CART BUTTON */}
                            {product.count > 0 ? (
                              <Button
                                fullWidth
                                variant="contained"
                                startIcon={<ShoppingCartOutlinedIcon />}
                                onClick={(e) => {
                                  e.stopPropagation();

                                  addToCart(product);
                                }}
                                sx={{
                                  mt: 1,
                                  bgcolor: isAdded ? "#EDF9F3" : "#FFD814",
                                  color: isAdded ? "#065334" : "#0f1111",
                                  borderRadius: 4,
                                  textTransform: "none",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  boxShadow: "none",

                                  "&:hover": {
                                    bgcolor: isAdded ? "#E1F5EC" : "#F7CA00",
                                    boxShadow: "none",
                                  },
                                }}
                              >
                                {isAdded ? "Add More" : "Add to Cart"}
                              </Button>
                            ) : (
                              <Button
                                fullWidth
                                disabled
                                sx={{
                                  mt: 1,
                                  bgcolor: "#eeeeee",
                                  color: "#777",
                                  borderRadius: 4,
                                  textTransform: "none",
                                  fontSize: "12px",
                                }}
                              >
                                Out of Stock
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </Box>
                </>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </UserLayout>
  );
}

export default Products;