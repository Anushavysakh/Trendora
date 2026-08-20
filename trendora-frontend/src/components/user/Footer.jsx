import { Box, Typography } from "@mui/material";

function Footer() {
  return (
    <Box
      sx={{
        mt: 5,
        py: 3,
        textAlign: "center",
        bgcolor: "#111",
        color: "#fff",
      }}
    >
      <Typography variant="h6">
        Trendora
      </Typography>

      <Typography variant="body2">
        Luxury Fashion & Jewellery
      </Typography>

      <Typography
        variant="caption"
        display="block"
        mt={1}
      >
        © 2026 Trendora. All Rights Reserved.
      </Typography>
    </Box>
  );
}

export default Footer;