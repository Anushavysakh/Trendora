import { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

function Hero() {
  const navigate = useNavigate();

  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveBanner = async () => {
      try {
        const res = await api.get("/banners/active");

        console.log("ACTIVE BANNER:", res.data);

        if (
          res.data.success &&
          res.data.banners &&
          res.data.banners.length > 0
        ) {
          setBanner(res.data.banners[0]);
        }
      } catch (error) {
        console.error("Banner fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveBanner();
  }, []);

  // Loading
  if (loading) {
    return (
      <Box
        sx={{
          height: "75vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <CircularProgress sx={{ color: "#C8A74E" }} />
      </Box>
    );
  }

  // No banner in database
  if (!banner) {
    return (
      <Box
        sx={{
          height: "75vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        <HeroContent navigate={navigate} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "75vh",
        backgroundImage: `url("${banner.image}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <HeroContent
        navigate={navigate}
        title={banner.title}
        subtitle={banner.subtitle}
      />
    </Box>
  );
}

function HeroContent({
  navigate,
  title = "Luxury Fashion",
  subtitle = "Discover Premium Jewellery & Clothing Collections",
}) {
  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        bgcolor: "rgba(0,0,0,.45)",
        display: "flex",
        alignItems: "center",
        px: { xs: 3, sm: 5, md: 8 },
      }}
    >
      <Box
        sx={{
          color: "#fff",
          maxWidth: 500,
        }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            fontSize: {
              xs: "2.5rem",
              sm: "3.5rem",
              md: "4rem",
            },
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            mt: 2,
            fontSize: {
              xs: "1.1rem",
              sm: "1.4rem",
              md: "1.5rem",
            },
          }}
        >
          {subtitle}
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 4,
            bgcolor: "#C8A74E",
            px: 5,
            py: 1.5,
            fontWeight: 600,
            "&:hover": {
              bgcolor: "#b89436",
            },
          }}
          onClick={() => navigate("/products")}
        >
          Shop Now
        </Button>
      </Box>
    </Box>
  );
}

export default Hero;