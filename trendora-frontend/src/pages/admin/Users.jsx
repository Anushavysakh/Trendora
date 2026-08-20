import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  IconButton,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [openView, setOpenView] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

const fetchUsers = async () => {
  try {
    const res = await api.get("/users");

    console.log("Users API Response:", res.data);

    setUsers(res.data);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleBlock = async (id) => {
    try {
      await api.put(`/users/${id}/block`);

      fetchUsers();
      setSnackbar({
        open: true,
        message: "User Updated Successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Failed to Update User",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteId}`);

      setUsers((prev) =>
        prev.filter((u) => u._id !== deleteId)
      );

      setOpenDelete(false);

      setSnackbar({
        open: true,
        message: "User Deleted Successfully",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: "Delete Failed",
        severity: "error",
      });
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        mt={10}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (<Container maxWidth="xl" sx={{ mt: 4 }}>

  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mb={3}
  >
    <Typography
      variant="h4"
      fontWeight="bold"
    >
      Users
    </Typography>
  </Box>

  <TextField
    label="Search Users"
    fullWidth
    sx={{ mb: 3 }}
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <Paper elevation={3}>

    <Table>

      <TableHead
        sx={{
          background: "#f5f5f5",
        }}
      >

        <TableRow>

          <TableCell>
            <b>Name</b>
          </TableCell>

          <TableCell>
            <b>Email</b>
          </TableCell>

          <TableCell>
            <b>Phone</b>
          </TableCell>

          <TableCell>
            <b>Role</b>
          </TableCell>

          <TableCell>
            <b>Status</b>
          </TableCell>

          <TableCell>
            <b>Joined</b>
          </TableCell>

          <TableCell align="center">
            <b>Actions</b>
          </TableCell>

        </TableRow>

      </TableHead>

      <TableBody>

        {filteredUsers.map((user) => (

          <TableRow
            key={user._id}
            hover
          >

            <TableCell>
              {user.name}
            </TableCell>

            <TableCell>
              {user.email}
            </TableCell>

            <TableCell>
              {user.phone || "-"}
            </TableCell>

            <TableCell>

              <Chip
                label={user.role}
                color={
                  user.role === "admin"
                    ? "warning"
                    : "primary"
                }
                size="small"
              />

            </TableCell>

            <TableCell>

              <Chip
                label={
                  user.isBlocked
                    ? "Blocked"
                    : "Active"
                }
                color={
                  user.isBlocked
                    ? "error"
                    : "success"
                }
              />

            </TableCell>

            <TableCell>

              {new Date(user.createdAt).toLocaleDateString()}

            </TableCell>

            <TableCell align="center">

              <IconButton
                color="primary"
                onClick={() => {
                  setSelectedUser(user);
                  setOpenView(true);
                }}
              >
                <VisibilityIcon />
              </IconButton>

              <IconButton
                color="warning"
                onClick={() =>
                  handleBlock(user._id)
                }
              >
                <BlockIcon />
              </IconButton>

              <IconButton
                color="error"
                onClick={() => {
                  setDeleteId(user._id);
                  setOpenDelete(true);
                }}
              >
                <DeleteIcon />
              </IconButton>

            </TableCell>

          </TableRow>

        ))}

      </TableBody>

    </Table>

  </Paper>
        {/* View User Dialog */}

      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          User Details
        </DialogTitle>

        <DialogContent>

          {selectedUser && (

            <Box mt={1}>

              <Typography mb={2}>
                <b>Name :</b> {selectedUser.name}
              </Typography>

              <Typography mb={2}>
                <b>Email :</b> {selectedUser.email}
              </Typography>

              <Typography mb={2}>
                <b>Phone :</b> {selectedUser.phone || "-"}
              </Typography>

              <Typography mb={2}>
                <b>Role :</b> {selectedUser.role}
              </Typography>

              <Typography mb={2}>
                <b>Status :</b>{" "}

                <Chip
                  label={
                    selectedUser.isBlocked
                      ? "Blocked"
                      : "Active"
                  }
                  color={
                    selectedUser.isBlocked
                      ? "error"
                      : "success"
                  }
                  size="small"
                />

              </Typography>

              <Typography>
                <b>Joined :</b>{" "}
                {new Date(
                  selectedUser.createdAt
                ).toLocaleString()}
              </Typography>

            </Box>

          )}

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setOpenView(false)}
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

      {/* Delete Dialog */}

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >

        <DialogTitle>
          Delete User
        </DialogTitle>

        <DialogContent>

          Are you sure you want to delete this user?

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setOpenDelete(false)}
          >
            Cancel
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={handleDelete}
          >
            Delete
          </Button>

        </DialogActions>

      </Dialog>

      {/* Snackbar */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar({
            ...snackbar,
            open: false,
          })
        }
      >

        <Alert
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>

      </Snackbar>

    </Container>

  );

}

export default Users;
