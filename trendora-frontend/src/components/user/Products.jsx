import { Container, Grid, Typography } from "@mui/material";
import ProductCard from "../../components/common/ProductCard";

const products = [
  {
    id: 1,
    name: "Royal Pearl Earrings",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600",
    price: 799,
    mrp: 1299,
  },
  {
    id: 2,
    name: "Luxury Bracelet",
    image:
      "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600",
    price: 999,
    mrp: 1599,
  },
  {
    id: 3,
    name: "Golden Necklace",
    image:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600",
    price: 1499,
    mrp: 2299,
  },
];

function Products() {
  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 8,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: "#FFD700",
          mb: 5,
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Featured Products
      </Typography>

  <Grid container spacing={4}>
  {products.map((product) => (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      key={product.id}
    >
      <ProductCard product={product} />
    </Grid>
  ))}
</Grid>
    </Container>
  );
}

export default Products;