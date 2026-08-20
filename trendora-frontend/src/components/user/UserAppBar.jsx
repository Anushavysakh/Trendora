import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function UserAppBar({ hideCategoryNavigation = false }) {
  const navigate = useNavigate();

  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const [searchText, setSearchText] = useState("");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        bgcolor: "#fff",
        color: "#000",
      }}
    >
      <Toolbar>

        {/* Logo */}

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            cursor: "pointer",
            color: "#C8A74E",
          }}
          onClick={() => navigate("/")}
        >
          Trendora
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation */}

        <Button onClick={() => navigate("/")}>Home</Button>

        {!hideCategoryNavigation && (
          <>
            <Button onClick={() => navigate("/products?usertype=Women")}>
              Women
            </Button>

            <Button onClick={() => navigate("/products?usertype=Men")}>
              Men
            </Button>

            <Button onClick={() => navigate("/products?usertype=Kids")}>
              Kids
            </Button>
          </>
        )}
        <Box sx={{ flexGrow: 1 }} />

        {/* Search */}

        {/* SEARCH */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: 2,
            px: 1,
            width: {
              xs: 150,
              md: 280,
            },
          }}
        >
          <SearchIcon
            sx={{
              color: "#777",
              cursor: "pointer",
            }}
            onClick={() => {
              if (searchText.trim()) {
                navigate(
                  `/search?q=${encodeURIComponent(searchText)}`
                );
              }
            }}
          />

          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(e) =>
              setSearchText(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchText.trim()) {
                navigate(
                  `/search?q=${encodeURIComponent(searchText)}`
                );
              }
            }}
            style={{
              border: "none",
              outline: "none",
              width: "100%",
              padding: "8px",
              fontSize: "14px",
            }}
          />
        </Box>

        {/* Wishlist */}

        <IconButton
          onClick={() => navigate("/wishlist")}
        >
          <FavoriteBorderIcon />
        </IconButton>

        {/* Cart */}

        <IconButton onClick={() => navigate("/cart")}>
          <Badge
            badgeContent={totalItems}
            color="error"
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>

        {/* User */}

        {user ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                ml: 2,
              }}
              onClick={handleClick}
            >
              <IconButton>
                <PersonOutlineOutlinedIcon />
              </IconButton>

              <Typography
                fontWeight={600}
                ml={0.5}
              >
                Hi, {user.name.split(" ")[0]}
              </Typography>

              <KeyboardArrowDownIcon />
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  minWidth: 220,
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  handleClose();
                }}
              >
                👤 My Profile
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate("/orders");
                  handleClose();
                }}
              >
                📦 My Orders
              </MenuItem>

              <MenuItem
                onClick={() => {
                  navigate("/wishlist");
                  handleClose();
                }}
              >
                ❤️ Wishlist
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={() => {
                  logout();
                  handleClose();
                  navigate("/");
                }}
              >
                🚪 Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              ml: 2,
              bgcolor: "#C8A74E",
              color: "#fff",
              borderRadius: 2,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#B6922A",
              },
            }}
          >
            Login
          </Button>
        )}

      </Toolbar>
    </AppBar>
  );
}

export default UserAppBar;

