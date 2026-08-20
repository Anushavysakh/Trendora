import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Navigate to product details
  const handleCardClick = () => {
    navigate(`/product/${product._id || product.id}`);
  };

  // Add to cart without triggering card navigation
  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevents navigating to product details when clicking the button
    addToCart(product);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        borderRadius: 4,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
        transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 15px 35px rgba(0, 0, 0, 0.15)",
        },
      }}
    >
      <CardMedia
        component="img"
        height="260"
        image={product.image}
        alt={product.name}
        sx={{ objectFit: "cover", flexShrink: 0 }}
      />
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Typography>

        <Typography sx={{ color: "#888", mb: 2 }}>
          Stylish jewellery for every occasion.
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ color: "#000", fontWeight: 700 }}>
            ₹{product.price}
          </Typography>
          <Typography sx={{ color: "#999", textDecoration: "line-through" }}>
            ₹{product.mrp}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          onClick={handleAddToCart}
          sx={{
            bgcolor: "#FFD700",
            color: "#000",
            fontWeight: 700,
            textTransform: "none",
            width: "100%",
            borderRadius: 3,
            "&:hover": { bgcolor: "#FFC107" },
          }}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}

export default ProductCard;