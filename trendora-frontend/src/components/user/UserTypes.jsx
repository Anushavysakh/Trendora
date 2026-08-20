import { Box, Typography, Grid, Card, CardMedia } from "@mui/material";
import { useNavigate } from "react-router-dom";

const data = [
  {
    title: "Women",
    image: "/images/women.jpg",
    type: "Women",
  },
  {
    title: "Men",
    image: "/images/men.jpg",
    type: "Men",
  },
  {
    title: "Kids",
    image: "/images/kid.jpg",
    type: "Kids",
  },
  {
    title: "Home Decor & Gifting",
    image: "/images/homedecor.webp",
    type: "HomeDecorGifting",
  },
];

function UserTypes() {
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 8, px: 8 }}>
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        sx={{ color: "#10100dff", mb: 6 }}
      >
        Shop By User Type
      </Typography>

      <Grid
        container
        spacing={4}
        sx={{ alignItems: "center", justifyContent: "center" }}
      >
        {data.map((item) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 3 }}
            key={item.title}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                transition: ".3s",
                "&:hover": {
                  transform: "scale(1.03)",
                },
              }}
              onClick={() =>
                navigate(`/products?usertype=${item.type}`)
              }
            >
              <CardMedia
                component="img"
                image={item.image}
                sx={{
                  width: 300,
                  height: 380,
                  objectFit: "cover",
                }}
              />

              <Box sx={{ py: 2, mt: "auto" }}>
                <Typography
                  align="center"
                  variant="h5"
                  fontWeight="bold"
                  sx={{ px: 1 }}
                >
                  {item.title}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default UserTypes;