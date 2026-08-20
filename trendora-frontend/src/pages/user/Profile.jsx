import {
  Avatar,
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Profile() {

    const navigate = useNavigate();

    const { user, logout } = useAuth();

    return (

        <Box
            sx={{
                bgcolor: "#f5f5f5",
                minHeight: "100vh",
                py: 5,
            }}
        >

            <Container maxWidth="sm">

                <Paper
                    elevation={3}
                    sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >

                    {/* Header */}

                    <Box
                        sx={{
                            bgcolor: "#C8A74E",
                            color: "#fff",
                            textAlign: "center",
                            py: 5,
                        }}
                    >

                        <Avatar
                            sx={{
                                width: 90,
                                height: 90,
                                mx: "auto",
                                bgcolor: "#fff",
                                color: "#C8A74E",
                                mb: 2,
                            }}
                        >
                            <PersonOutlineOutlinedIcon
                                sx={{
                                    fontSize: 50,
                                }}
                            />
                        </Avatar>

                        <Typography
                            variant="h5"
                            fontWeight="bold"
                        >
                            {user?.name}
                        </Typography>

                        <Typography>
                            {user?.email}
                        </Typography>

                    </Box>

                    <List>

                        <ListItemButton
                            onClick={() => navigate("/orders")}
                        >
                            <ListItemIcon>
                                <ShoppingBagOutlinedIcon />
                            </ListItemIcon>

                            <ListItemText
                                primary="My Orders"
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton
                            onClick={() => navigate("/wishlist")}
                        >
                            <ListItemIcon>
                                <FavoriteBorderOutlinedIcon />
                            </ListItemIcon>

                            <ListItemText
                                primary="Wishlist"
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton
                            onClick={() => navigate("/address")}
                        >
                            <ListItemIcon>
                                <LocationOnOutlinedIcon />
                            </ListItemIcon>

                            <ListItemText
                                primary="Manage Address"
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton>
                            <ListItemIcon>
                                <SettingsOutlinedIcon />
                            </ListItemIcon>

                            <ListItemText
                                primary="Account Settings"
                            />
                        </ListItemButton>

                        <Divider />

                        <ListItemButton

                            onClick={() => {

                                logout();

                                navigate("/");

                            }}

                        >
                            <ListItemIcon>
                                <LogoutOutlinedIcon color="error" />
                            </ListItemIcon>

                            <ListItemText
                                primary="Logout"
                            />
                        </ListItemButton>

                    </List>

                </Paper>

            </Container>

        </Box>

    );
}

export default Profile;

