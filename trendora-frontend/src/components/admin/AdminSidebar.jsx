import {
    Drawer,
    List,
    ListItemButton,
    ListItemText,
    Toolbar,
    Collapse,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

function AdminSidebar({ onLogout }) {
    const location = useLocation();

    const [openProducts, setOpenProducts] = useState(
        location.pathname.startsWith("/admin/products")
    );

    const [openCategories, setOpenCategories] = useState(
        location.pathname.startsWith("/admin/categories")
    );
    const navigate = useNavigate();
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("admin");

        navigate("/admin/login");

    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 250,
                "& .MuiDrawer-paper": {
                    width: 250,
                    background: "#fff",
                    borderRight: "1px solid #ddd",
                },
            }}
        >
            <Toolbar />

            <List>

                {/* Dashboard */}

                <ListItemButton
                    component={Link}
                    to="/admin"
                    selected={location.pathname === "/admin"}
                >
                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                {/* Products */}

                <ListItemButton
                    onClick={() => setOpenProducts(!openProducts)}
                >
                    <ListItemText primary="Products" />
                    {openProducts ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={openProducts}>
                    <List disablePadding>

                        <ListItemButton
                            component={Link}
                            to="/admin/products"
                            selected={location.pathname === "/admin/products"}
                            sx={{ pl: 4 }}
                        >
                            <ListItemText primary="All Products" />
                        </ListItemButton>



                        <ListItemButton
                            component={Link}
                            to="/admin/products/add"
                            selected={location.pathname === "/admin/products/add"}
                            sx={{ pl: 4 }}
                        >
                            <ListItemText primary="+ Add Product" />
                        </ListItemButton>

                    </List>
                </Collapse>

                {/* Categories */}

                <ListItemButton
                    onClick={() => setOpenCategories(!openCategories)}
                >
                    <ListItemText primary="Categories" />
                    {openCategories ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={openCategories}>
                    <List disablePadding>

                        <ListItemButton
                            component={Link}
                            to="/admin/categories"
                            selected={location.pathname === "/admin/categories"}
                            sx={{ pl: 4 }}
                        >
                            <ListItemText primary="All Categories" />
                        </ListItemButton>
                        <ListItemButton
                            component={Link}
                            to="/admin/categories/add"
                            selected={location.pathname === "/admin/categories/add"}
                            sx={{ pl: 4 }}
                        >
                            <ListItemText primary="+ Add Category" />
                        </ListItemButton>
                    </List>
                </Collapse>

                {/* Banners */}

                <ListItemButton
                    component={Link}
                    to="/admin/banners"
                    selected={location.pathname === "/admin/banners"}
                >
                    <ListItemText primary="Banners" />
                </ListItemButton>
                {/* Other Menu */}

                <ListItemButton component={Link} to="/admin/orders">
                    <ListItemText primary="Orders" />
                </ListItemButton>

                <ListItemButton component={Link} to="/admin/users">
                    <ListItemText primary="Users" />
                </ListItemButton>
                <ListItemButton
                    component={Link}
                    to="/admin/reviews"
                    selected={location.pathname === "/admin/reviews"}
                >
                    <ListItemText primary="Reviews" />
                </ListItemButton>

                <ListItemButton onClick={handleLogout}>

                    <LogoutIcon sx={{ mr: 2 }} />

                    <ListItemText primary="Logout" />

                </ListItemButton>
            </List>
        </Drawer>
    );
}

export default AdminSidebar;