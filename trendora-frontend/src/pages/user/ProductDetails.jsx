// ProductDetails.jsx

import { useEffect, useState } from "react";

import api from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import BackButton from "../../components/common/BackButton";

import {
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Rating,
  IconButton,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import UserLayout from "../../layouts/UserLayout";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");

  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);

        setProduct(res.data);

        if (res.data.images?.length > 0) {
          setSelectedImage(res.data.images[0]);
        } else {
          setSelectedImage(res.data.image);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <UserLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </UserLayout>
    );
  }

  // Product not found
  if (!product) {
    return (
      <UserLayout>
        <Box textAlign="center" mt={10}>
          <Typography variant="h5">
            Product Not Found
          </Typography>
        </Box>
      </UserLayout>
    );
  }

  // Images
  const images = [
    product.image,
    ...(product.images || []),
  ].filter(Boolean);

  // Wishlist status
  const saved = isInWishlist(product._id);

  // Discount
  const discount =
    product.mrp && product.mrp > product.price
      ? Math.round(
        ((product.mrp - product.price) /
          product.mrp) *
        100
      )
      : 0;

  // Description
  const descriptionPoints =
    product.description
      ?.split("\n")
      .filter((x) => x.trim() !== "") || [];

  // Wishlist handler
  const handleWishlist = () => {
    if (saved) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <UserLayout hideCategoryNavigation> 

      <Box
        sx={{
          maxWidth: 1400,
          mx: "auto",
          px: {
            xs: 2,
            md: 4,
          },
          py: 2,
        }}
      >

        {/* BACK BUTTON */}

        <BackButton />

        {/* BREADCRUMB */}

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 3,
            fontSize: "13px",
          }}
        >
          {product.category}
          {" › "}
          {product.subCategory}
          {" › "}
          {product.name}
        </Typography>


        {/* MAIN CONTENT */}

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 6,
            alignItems: "flex-start",
          }}
        >

          {/* LEFT IMAGE SECTION */}

          <Box
            sx={{
              flex: "0 0 450px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,

              position: {
                xs: "static",
                md: "sticky",
              },

              top: 90,
            }}
          >

            {/* MAIN IMAGE */}

            <Paper
              elevation={0}
              sx={{
                width: "100%",
                height: {
                  xs: 400,
                  md: 550,
                },

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                p: 1,

                border: "1px solid #f0f0f0",
              }}
            >

              <Box
                component="img"
                src={selectedImage}
                alt={product.name}
                sx={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />

            </Paper>


            {/* THUMBNAILS */}

            <Box
              display="flex"
              flexWrap="wrap"
              justifyContent="center"
              gap={1.5}
            >

              {images.map((img, index) => (

                <Box
                  key={index}
                  component="img"
                  src={img}
                  alt={`${product.name} ${index + 1}`}
                  onClick={() =>
                    setSelectedImage(img)
                  }
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",

                    border:
                      selectedImage === img
                        ? "2px solid #007185"
                        : "1px solid #ddd",

                    borderRadius: 1,
                    cursor: "pointer",

                    "&:hover": {
                      border: "2px solid #007185",
                    },
                  }}
                />

              ))}

            </Box>

          </Box>


          {/* RIGHT PRODUCT DETAILS */}

          <Box
            sx={{
              flex: 1,
              width: "100%",
            }}
          >

            {/* PRODUCT TITLE + WISHLIST */}

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
            >

              <Typography
                variant="h5"
                fontWeight={400}
                sx={{
                  lineHeight: 1.3,
                  mb: 0.5,
                  color: "#0f1111",
                }}
              >
                {product.name}
              </Typography>


              <IconButton
                onClick={handleWishlist}
                sx={{
                  color: saved
                    ? "red"
                    : "#777",
                }}
              >
                {saved ? (
                  <FavoriteIcon />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>

            </Box>


          


            {/* RATING */}

            <Box
              display="flex"
              alignItems="center"
              gap={1}
              mt={0.5}
            >

           

            </Box>


            <Divider sx={{ my: 1.5 }} />


            {/* PRICE */}

            <Box
              display="flex"
              alignItems="baseline"
              gap={1}
            >

              <Typography
                variant="body1"
                color="error"
                sx={{
                  fontSize: 24,
                  fontWeight: 300,
                }}
              >
                -{discount}%
              </Typography>


              <Typography
                variant="h4"
                fontWeight={400}
              >
                <Typography
                  component="span"
                  variant="h6"
                  sx={{
                    verticalAlign: "super",
                    fontSize: 14,
                  }}
                >
                  ₹
                </Typography>

                {product.price}

              </Typography>

            </Box>


            {/* MRP */}

            <Typography
              sx={{
                textDecoration: "line-through",
                color: "gray",
                fontSize: 13,
                mt: 0.5,
              }}
            >
              M.R.P.: ₹{product.mrp}
            </Typography>


            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{
                mb: 2,
              }}
            >
              Inclusive of all taxes
            </Typography>


            {/* SPECIFICATIONS */}

            <Box
              sx={{
                my: 2,
                maxWidth: 450,
              }}
            >

              <Table
                size="small"
                sx={{
                  "& .MuiTableCell-root": {
                    borderBottom: "none",
                    py: 0.6,
                    px: 0,
                    fontSize: "14px",
                  },
                }}
              >

                <TableBody>

                  <TableRow>
                    <TableCell
                      sx={{
                        width: "35%",
                        fontWeight: "bold",
                        color: "#565959",
                      }}
                    >
                      Category
                    </TableCell>

                    <TableCell>
                      {product.category}
                    </TableCell>
                  </TableRow>


                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#565959",
                      }}
                    >
                      Sub Category
                    </TableCell>

                    <TableCell>
                      {product.subCategory}
                    </TableCell>
                  </TableRow>


                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#565959",
                      }}
                    >
                      Suitable For
                    </TableCell>

                    <TableCell>
                      {Array.isArray(product.usertype)
                        ? product.usertype.join(", ")
                        : product.usertype}
                    </TableCell>
                  </TableRow>


                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#565959",
                      }}
                    >
                      Material
                    </TableCell>

                    <TableCell>
                      Premium Alloy
                    </TableCell>
                  </TableRow>


                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: "#565959",
                      }}
                    >
                      Finish
                    </TableCell>

                    <TableCell>
                      18K Gold Plated
                    </TableCell>
                  </TableRow>

                </TableBody>

              </Table>

            </Box>


            <Divider sx={{ my: 2 }} />


            {/* DESCRIPTION */}

            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{
                fontSize: "16px",
                color: "#0f1111",
              }}
              gutterBottom
            >
              About this item
            </Typography>


            <Box
              component="ul"
              sx={{
                pl: 2,
                m: 0,
                "& li": {
                  mb: 0.8,
                },
              }}
            >

              {descriptionPoints.map(
                (point, index) => (

                  <li key={index}>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#0f1111",
                        lineHeight: 1.5,
                        fontSize: "14px",
                      }}
                    >
                      {point}
                    </Typography>

                  </li>

                )
              )}

            </Box>


            <Divider sx={{ my: 2.5 }} />


            {/* DELIVERY INFO */}

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                mb: 2,
              }}
            >

              <Typography variant="body2">
                🚚 Free Delivery above ₹499
              </Typography>

              <Typography variant="body2">
                🔄 7 Days Easy Return
              </Typography>

              <Typography variant="body2">
                🔒 Secure Payments
              </Typography>

            </Box>


            {/* STOCK */}

            <Typography
              fontWeight="bold"
              variant="body2"
              mb={3}
            >
              Availability:{" "}

              <Box
                component="span"
                color={
                  product.count > 0
                    ? "green"
                    : "red"
                }
              >
                {product.count > 0
                  ? "In Stock"
                  : "Out Of Stock"}
              </Box>

            </Typography>


            {/* BUTTONS */}

            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
            >
              {/* BUTTONS */}

              {product.count > 0 ? (

                <Box
                  display="flex"
                  gap={13}
                  flexWrap="wrap"

                >

                  {/* ADD TO CART */}

                  <Button
                    variant="contained"
                    onClick={() => {
                      addToCart(product);
                    }}
                    sx={{
                      bgcolor: "#FFD814",
                      color: "#111",
                      width: 160,
                      height: 36,
                      textTransform: "none",
                      borderRadius: 5,
                      fontSize: "14px",
                      boxShadow: "none",

                      "&:hover": {
                        bgcolor: "#F7CA00",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Add to Cart
                  </Button>


                  {/* BUY NOW */}

                  <Button 
                  
                    variant="contained"
                    onClick={() => {

                      // Add product to cart
                      addToCart(product);

                      // Go directly to checkout
                      navigate("/checkout");

                    }}
                    sx={{
                      bgcolor: "#FFA41C",
                      color: "#111",
                      width: 160,
                      height: 36,
                      textTransform: "none",
                      borderRadius: 5,
                      fontSize: "14px",
                      boxShadow: "none",

                      "&:hover": {
                        bgcolor: "#FA8900",
                        boxShadow: "none",
                      },
                    }}
                  >
                    Buy Now
                  </Button>

                </Box>

              ) : (

                /* OUT OF STOCK */

                <Button
                  variant="contained"
                  disabled
                  sx={{
                    bgcolor: "#e0e0e0",
                    color: "#777",
                    width: 180,
                    height: 40,
                    textTransform: "none",
                    borderRadius: 5,
                    fontSize: "14px",
                    boxShadow: "none",
                  }}
                >
                  Out of Stock
                </Button>

              )}

            </Box>

          </Box>

        </Box>

      </Box>

    </UserLayout>
  );
}

export default ProductDetails;