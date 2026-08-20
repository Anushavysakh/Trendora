import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
  Container,
  Grid,
} from "@mui/material";

const categories = [
  {
    title: "Women",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600",
  },
  {
    title: "Men",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600",
  },
  {
    title: "Kids",
    image:
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600",
  },
];

function Categories() {
  return (
    <Box
      sx={{
        background: "#000",
        py: 8,
      }}
    >
      <Container>
        <Typography
          variant="h3"
          align="center"
          sx={{
            color: "#FFD700",
            fontWeight: "bold",
            mb: 6,
          }}
        >
          Shop By Category
        </Typography>

        <Grid container spacing={4}>
          {categories.map((item) => (
            <Grid size={{ xs: 12, md: 4 }} key={item.title}>
              <Card
                sx={{
                  bgcolor: "#111",
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: ".4s",

                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 0 25px rgba(255,215,0,.3)",
                  },
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    image={item.image}
                    height="420"
                  />

                  <Box sx={{ py: 2 }}>
                    <Typography
                      align="center"
                      variant="h5"
                      sx={{
                        color: "#FFD700",
                        fontWeight: "bold",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </Box>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Categories;