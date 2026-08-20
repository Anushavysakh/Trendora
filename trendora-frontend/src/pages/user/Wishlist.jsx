import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  IconButton,
} from "@mui/material";

import DeleteIcon from
  "@mui/icons-material/Delete";

import { useNavigate } from "react-router-dom";

import {
  useWishlist,
} from "../../context/WishlistContext";

import {
  useCart,
} from "../../context/CartContext";

import BackButton from
  "../../components/common/BackButton";

function Wishlist() {
  const navigate = useNavigate();

  const {
    wishlistItems,
    removeFromWishlist,
  } = useWishlist();

  const {
    addToCart,
  } = useCart();

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 3,
      }}
    >
      <BackButton />

      <Typography
        variant="h4"
        fontWeight={700}
        mb={4}
      >
        My Wishlist
      </Typography>

      {wishlistItems.length === 0 ? (
        <Paper
          sx={{
            p: 5,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            Your wishlist is empty
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((item) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={item._id}
            >
              <Paper
                sx={{
                  p: 2,
                  height: "100%",
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  sx={{
                    width: "100%",
                    height: 220,
                    objectFit: "contain",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    navigate(
                      `/products/${item._id}`
                    )
                  }
                />

                <Typography
                  fontWeight={700}
                  mt={2}
                >
                  {item.name}
                </Typography>

                <Typography mt={1}>
                  ₹{item.price}
                </Typography>

                <Box
                  display="flex"
                  gap={1}
                  mt={2}
                >
                  <Button
                    variant="contained"
                    onClick={() =>
                      addToCart(item)
                    }
                  >
                    Add to Cart
                  </Button>

                  <IconButton
                    color="error"
                    onClick={() =>
                      removeFromWishlist(
                        item._id
                      )
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Wishlist;