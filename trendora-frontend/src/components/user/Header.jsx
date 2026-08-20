import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { Link } from "react-router-dom";

function Header() {
  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "#fff",
        color: "#000",
        boxShadow: 1,
      }}
    >
      <Toolbar>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            color: "#C8A74E",
            mr: 5,
          }}
        >
          Trendora
        </Typography>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            maxWidth: 450,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search products..."
          />

          <IconButton>
            <SearchIcon />
          </IconButton>
        </Box>

        <Box sx={{ ml: 5 }}>

          <Button component={Link} to="/">
            Women
          </Button>

          <Button component={Link} to="/">
            Men
          </Button>

          <Button component={Link} to="/">
            Kids
          </Button>

        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton>
          <Badge badgeContent={0} color="error">
            <FavoriteBorderIcon />
          </Badge>
        </IconButton>

        <IconButton>
          <Badge badgeContent={0} color="error">
            <ShoppingCartOutlinedIcon />
          </Badge>
        </IconButton>

        <IconButton>
          <PersonOutlineIcon />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
}

export default Header;