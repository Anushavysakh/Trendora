import { Box, Typography, Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const users = [
    {
        title: "Women",
        image: "images/kid.jpg",
    },
    {
        title: "Men",
        image: "images/men.jpg",
    },
    {
        title: "Kids",
        image: "images/kid.jpg",
    },
];

function ShopByUserType() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                py: 8,
                px: {
                    xs: 1,
                    md: 1,
                },
                background: "#fafafa",
            }}
        >           <Typography
            variant="h3"
            align="center"
            fontWeight="bold"
            mb={20}
        >
                Shop By User Type
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {users.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.title}>
                        <Paper
                            elevation={4}
                            onClick={() =>
                                navigate(`/products?usertype=${item.title}`)
                            }
                            sx={{
                                cursor: "pointer",
                                borderRadius: 3,
                                overflow: "hidden",
                                transition: "0.3s",
                                "&:hover": {
                                    transform: "translateY(-8px)",
                                    boxShadow: 8,
                                },
                            }}
                        >
                            <Box
                                component="img"
                                src={item.image}
                                alt={item.title}
                                sx={{
                                    width: "100%",
                                    height: 320,
                                    objectFit: "cover",
                                }}
                            />

                            <Box sx={{ py: 2 }}>
                                <Typography
                                    variant="h5"
                                    align="center"
                                    fontWeight="bold"
                                >
                                    {item.title}
                                </Typography>

                                <Typography
                                    align="center"
                                    color="text.secondary"
                                >
                                    Explore Collection
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default ShopByUserType;
