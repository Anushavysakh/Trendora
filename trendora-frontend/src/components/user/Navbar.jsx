import React from "react";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

function Navbar() {
  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#000",
        borderBottom: "1px solid #222",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
        }}
      >
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            color: "#FFD700",
            fontWeight: "bold",
            letterSpacing: 3,
            cursor: "pointer",
          }}
        >
          TRENDORA
        </Typography>

        {/* Menu */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button sx={menuStyle}>Home</Button>
          <Button sx={menuStyle}>Women</Button>
          <Button sx={menuStyle}>Men</Button>
          <Button sx={menuStyle}>Kids</Button>
          <Button sx={menuStyle}>Jewellery</Button>
        </Box>

        {/* Icons */}
        <Box sx={{ display: "flex" }}>
          <IconButton sx={iconStyle}>
            <SearchIcon />
          </IconButton>

          <IconButton sx={iconStyle}>
            <FavoriteBorderIcon />
          </IconButton>

          <IconButton sx={iconStyle}>
            <ShoppingCartOutlinedIcon />
          </IconButton>

          <IconButton sx={iconStyle}>
            <PersonOutlineOutlinedIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

const menuStyle = {
  color: "#fff",
  textTransform: "none",
  fontSize: "15px",
  fontWeight: 500,

  "&:hover": {
    color: "#FFD700",
    backgroundColor: "transparent",
  },
};

const iconStyle = {
  color: "#fff",

  "&:hover": {
    color: "#FFD700",
  },
};

export default Navbar;