import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
} from "@mui/material";
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Box,
    TextField,
    Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Categories() {
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    const [deleteId, setDeleteId] = useState(null);

    const [openDelete, setOpenDelete] = useState(false);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");

            setCategories(res.data);
        } catch (err) {
            console.log(err);
        }
    };


    const handleDelete = async () => {

        try {

            await api.delete(`/categories/${deleteId}`);

            setCategories((prev) =>
                prev.filter((c) => c._id !== deleteId)
            );

            setSnackbar({
                open: true,
                message: "Category Deleted Successfully",
                severity: "success",
            });

            setOpenDelete(false);

        } catch (error) {

            setSnackbar({
                open: true,
                message: "Failed to Delete Category",
                severity: "error",
            });

        }

    };
    useEffect(() => {
        fetchCategories();
    }, []);

    const filtered = categories.filter((item) =>
        item.category.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
            >
                <Typography variant="h4" fontWeight="bold">
                    Categories
                </Typography>

                <Button
                    component={Link}
                    to="/admin/categories/add"
                    variant="contained"
                    sx={{
                        bgcolor: "#C8A74E",
                        "&:hover": {
                            bgcolor: "#B8922D",
                        },
                    }}
                >
                    + Add Category
                </Button>
            </Box>

            <TextField
                label="Search Category"
                fullWidth
                sx={{ mb: 3 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <TableContainer component={Paper}>

                <Table>

                    <TableHead>

                        <TableRow>

                            <TableCell>
                                <b>Category</b>
                            </TableCell>

                            <TableCell>
                                <b>User Type</b>
                            </TableCell>

                            <TableCell>
                                <b>Sub Categories</b>
                            </TableCell>

                            <TableCell align="center">
                                <b>Actions</b>
                            </TableCell>

                        </TableRow>

                    </TableHead>

                    <TableBody>

                        {filtered.map((category) => (

                            <TableRow key={category._id}>

                                <TableCell>
                                    {category.category}
                                </TableCell>

                                <TableCell>

                                    {category.usertype.map((u) => (
                                        <Chip
                                            key={u}
                                            label={u}
                                            size="small"
                                            sx={{
                                                mr: 1,
                                                mb: 1,
                                            }}
                                        />
                                    ))}

                                </TableCell>

                                <TableCell>

                                    {category.subCategories.map((sub) => (
                                        <Chip
                                            key={sub}
                                            label={sub}
                                            size="small"
                                            sx={{
                                                mr: 1,
                                                mb: 1,
                                            }}
                                        />
                                    ))}

                                </TableCell>

                                <TableCell align="center">

                                    <IconButton
                                        color="primary"
                                        onClick={() =>
                                            navigate(`/admin/categories/edit/${category._id}`)
                                        }
                                    >
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton
                                        color="error"
                                        onClick={() => {
                                            setDeleteId(category._id);
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

            </TableContainer>
            <Dialog
                open={openDelete}
                onClose={() => setOpenDelete(false)}
            >
                <DialogTitle>
                    Delete Category
                </DialogTitle>

                <DialogContent>
                    Are you sure you want to delete this category?
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>
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

export default Categories;