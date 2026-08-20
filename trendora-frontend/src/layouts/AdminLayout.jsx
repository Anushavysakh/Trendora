import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

function AdminLayout() {
  return (
    <>
      <AdminSidebar />

      <Box
        sx={{
          ml: "240px",
          p: 4,
          background: "#f7f7f7",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </>
  );
}

export default AdminLayout;