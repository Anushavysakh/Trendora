import { useEffect, useState } from "react";
import api from "../../services/api";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
    Container,
    Typography,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Chip,
    Box,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Snackbar,
    Alert,
    Select,
} from "@mui/material";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [selectedOrder, setSelectedOrder] = useState(null);

    const [openView, setOpenView] = useState(false);

    const [deleteId, setDeleteId] = useState(null);

    const [openDelete, setOpenDelete] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    const [editOrder, setEditOrder] = useState(null);

    const [statusValue, setStatusValue] = useState("");

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchOrders = async () => {
        try {
            const res = await api.get("/orders");

            setOrders(res.data);

        } catch (error) {
            console.log(error);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={8}
            >
                <CircularProgress />
            </Box>
        );
    }
    const filteredOrders = orders.filter((order) => {

        const customer = order.shippingAddress?.name || "";

        const matchesSearch =
            customer.toLowerCase().includes(search.toLowerCase()) ||
            order._id.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
            status === "" || order.orderStatus === status;

        return matchesSearch && matchesStatus;

    });

    const handleStatusUpdate = async () => {
        try {

            await api.put(`/orders/${editOrder._id}/status`, {
                orderStatus: statusValue,
            });

            setOrders((prev) =>
                prev.map((o) =>
                    o._id === editOrder._id
                        ? { ...o, orderStatus: statusValue }
                        : o
                )
            );

            setSnackbar({
                open: true,
                message: "Order Status Updated",
                severity: "success",
            });

            setOpenEdit(false);

        } catch (error) {

            setSnackbar({
                open: true,
                message: "Failed to Update",
                severity: "error",
            });

        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
                mb={3}
            >
                Orders
            </Typography>

            <Box
                display="flex"
                gap={2}
                mb={3}
            >

                <TextField
                    label="Search Customer / Order ID"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    size="small"
                    sx={{ width: 350 }}
                />

                <TextField
                    select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    size="small"
                    sx={{ width: 220 }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>

            </Box>

            <Paper>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell><b>Order ID</b></TableCell>

                            <TableCell><b>Customer</b></TableCell>

                            <TableCell><b>Total</b></TableCell>

                            <TableCell><b>Payment</b></TableCell>

                            <TableCell><b>Status</b></TableCell>

                            <TableCell><b>Date</b></TableCell>
                            <TableCell align="center">
                                <b>Actions</b>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {filteredOrders.map((order) => (

                            <TableRow key={order._id}>

                                <TableCell>
                                    {order._id.slice(-6)}
                                </TableCell>

                                <TableCell>
                                    {order.shippingAddress?.name}
                                </TableCell>

                                <TableCell>
                                    ₹{order.totalAmount}
                                </TableCell>

                                <TableCell>
                                    {order.paymentMethod}
                                </TableCell>

                                <TableCell>

                                    <Chip
                                        label={order.orderStatus}
                                        color={
                                            order.orderStatus === "Delivered"
                                                ? "success"
                                                : order.orderStatus === "Cancelled"
                                                    ? "error"
                                                    : "warning"
                                        }
                                    />

                                </TableCell>

                                <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="center">

                                    <IconButton
                                        color="primary"
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setOpenView(true);
                                        }}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>

                                    <IconButton
                                        color="success"
                                        onClick={() => {
                                            setEditOrder(order);
                                            setStatusValue(order.orderStatus);
                                            setOpenEdit(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton
                                        color="error"
                                        onClick={() => {
                                            setDeleteId(order._id);
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
                <Dialog
                    open={openView}
                    onClose={() => setOpenView(false)}
                    maxWidth="md"
                    fullWidth
                >

                    <DialogTitle>
                        Order Details
                    </DialogTitle>

                    <DialogContent>

                        {selectedOrder && (

                            <>

                                <Typography>
                                    <b>Customer :</b> {selectedOrder.shippingAddress.name}
                                </Typography>

                                <Typography>
                                    <b>Phone :</b> {selectedOrder.shippingAddress.phone}
                                </Typography>

                                <Typography>
                                    <b>Address :</b> {selectedOrder.shippingAddress.address}
                                </Typography>

                                <Typography>
                                    {selectedOrder.shippingAddress.city},
                                    {" "}
                                    {selectedOrder.shippingAddress.state}
                                </Typography>

                                <Typography>
                                    PIN : {selectedOrder.shippingAddress.pincode}
                                </Typography>

                                <Typography mt={3}>
                                    <b>Products</b>
                                </Typography>

                                {selectedOrder.items.map((item) => (

                                    <Paper
                                        key={item._id}
                                        sx={{
                                            p: 2,
                                            mt: 2,
                                        }}
                                    >

                                        <Typography>
                                            {item.name}
                                        </Typography>

                                        <Typography>
                                            Qty : {item.qty}
                                        </Typography>

                                        <Typography>
                                            ₹{item.price}
                                        </Typography>

                                    </Paper>

                                ))}

                            </>

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
                <Dialog
  open={openEdit}
  onClose={() => setOpenEdit(false)}
>
  <DialogTitle>
    Update Order Status
  </DialogTitle>

  <DialogContent sx={{ mt: 2 }}>

    <TextField
      select
      fullWidth
      label="Status"
      value={statusValue}
      onChange={(e) => setStatusValue(e.target.value)}
    >
      <MenuItem value="Pending">Pending</MenuItem>
      <MenuItem value="Processing">Processing</MenuItem>
      <MenuItem value="Shipped">Shipped</MenuItem>
      <MenuItem value="Delivered">Delivered</MenuItem>
      <MenuItem value="Cancelled">Cancelled</MenuItem>
    </TextField>

  </DialogContent>

  <DialogActions>

    <Button onClick={() => setOpenEdit(false)}>
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleStatusUpdate}
    >
      Update
    </Button>

  </DialogActions>

</Dialog>
<Dialog
  open={openDelete}
  onClose={() => setOpenDelete(false)}
>
  <DialogTitle>
    Delete Order
  </DialogTitle>

  <DialogContent>
    Are you sure you want to delete this order?
  </DialogContent>

  <DialogActions>

    <Button onClick={() => setOpenDelete(false)}>
      Cancel
    </Button>

    <Button
      color="error"
      variant="contained"
    >
      Delete
    </Button>

  </DialogActions>
</Dialog>
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

            </Paper>

        </Container>
    );
}

export default Orders;