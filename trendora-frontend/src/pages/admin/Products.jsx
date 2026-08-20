import { useEffect, useState } from "react";
import api from "../../services/api";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  CircularProgress,
  Box,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [usertype, setUsertype] = useState("");
  const [stock, setStock] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const navigate = useNavigate();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchSubCategories = async (selectedCategory) => {
    try {
      if (!selectedCategory) {
        setSubCategories([]);
        return;
      }

      const res = await api.get("/categories", {
        params: {
          category: selectedCategory,
        },
      });

      if (res.data.length > 0) {
        setSubCategories(res.data[0].subCategories || []);
      } else {
        setSubCategories([]);
      }

    } catch (err) {
      console.log(err);
    }
  };


  const fetchProducts = async () => {
    try {
      const res = await api.get("/products", {
        params: {
          search,
          category,
          subCategory,
          usertype,
        },
      });

      let data = res.data.products;

      if (stock === "instock") {
        data = data.filter((p) => p.count > 0);
      }

      if (stock === "outofstock") {
        data = data.filter((p) => p.count === 0);
      }

      setProducts(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await api.get("/categories");
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!category) {
      setSubCategories([]);
      return;
    }

    const selected = categories.find(
      (c) =>
        c.category.trim().toLowerCase() ===
        category.trim().toLowerCase()
    );

    if (selected) {
      setSubCategories(selected.subCategories);
    } else {
      setSubCategories([]);
    }
  }, [category, categories]);


  useEffect(() => {
    fetchProducts();
  }, [search, category, subCategory, usertype, stock]);
  const handleDelete = async () => {
    try {
      await api.delete(`/products/${deleteId}`);

      setProducts((prev) =>
        prev.filter((p) => p._id !== deleteId)
      );

      setSnackbar({
        open: true,
        message: "Product Deleted Successfully",
        severity: "success",
      });

      setOpenDelete(false);
    } catch (err) {
      console.log(err);

      setSnackbar({
        open: true,
        message: "Failed to Delete Product",
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



  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>

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
          Products
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to="/admin/products/add"
          sx={{
            bgcolor: "#C8A74E",
            "&:hover": {
              bgcolor: "#B8922D",
            },
          }}
        >
          + Add Product
        </Button>
      </Box>

      <Box
        display="flex"
        gap={2}
        flexWrap="wrap"
        mb={3}
      >
        <TextField
          label="Search Product"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory("");
          }}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>

          {[
            ...new Map(
              categories.map((cat) => [
                cat.category.trim().toLowerCase(),
                {
                  name: cat.category.trim(),
                },
              ])
            ).values(),
          ].map((cat) => (
            <MenuItem
              key={cat.name}
              value={cat.name}
            >
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Sub Category"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>

          {subCategories.map((sub) => (
            <MenuItem key={sub} value={sub}>
              {sub}
            </MenuItem>
          ))}
        </TextField>


        <TextField
          select
          label="User Type"
          value={usertype}
          onChange={(e) => setUsertype(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Women">Women</MenuItem>
          <MenuItem value="Men">Men</MenuItem>
          <MenuItem value="Kids">Kids</MenuItem>
        </TextField>

        <TextField
          select
          label="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="instock">In Stock</MenuItem>
          <MenuItem value="outofstock">Out of Stock</MenuItem>
        </TextField>
      </Box>

      <Paper elevation={3}>

        <Table>

          <TableHead
            sx={{
              background: "#f5f5f5",
            }}
          >
            <TableRow>

              <TableCell><b>Image</b></TableCell>

              <TableCell><b>Name</b></TableCell>

              <TableCell><b>User Type</b></TableCell>

              <TableCell><b>Category</b></TableCell>

              <TableCell><b>Sub Category</b></TableCell>

              <TableCell><b>Price</b></TableCell>

              <TableCell><b>Stock</b></TableCell>

              <TableCell><b>Status</b></TableCell>

              <TableCell align="center">
                <b>Actions</b>
              </TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
  {products.length === 0 ? (
    <TableRow>
      <TableCell colSpan={9} align="center">
        <Typography sx={{ py: 4 }}>
          No Products Available
        </Typography>

        <Button
          component={Link}
          to="/admin/products/add"
          variant="contained"
          sx={{ mt: 2 }}
        >
          Add Product
        </Button>
      </TableCell>
    </TableRow>
  ) : (
    products.map((product) => (
      <TableRow key={product._id} hover>

        <TableCell>
          <img
            src={product.image}
            alt={product.name}
            width={70}
            height={70}
            style={{
              borderRadius: 12,
              objectFit: "cover",
              border: "1px solid #ddd",
            }}
          />
        </TableCell>

        <TableCell>{product.name}</TableCell>

        <TableCell>
          {product.usertype.map((u) => (
            <Chip
              key={u}
              label={u}
              size="small"
              sx={{ mr: 0.5 }}
            />
          ))}
        </TableCell>

        <TableCell>{product.category}</TableCell>

        <TableCell>{product.subCategory}</TableCell>

        <TableCell>
          <Box>
            <Typography fontWeight="bold" color="#C8A74E">
              ₹{product.price}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                textDecoration: "line-through",
                color: "gray",
              }}
            >
              ₹{product.mrp}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>{product.count}</TableCell>

        <TableCell>
          <Chip
            label={product.count > 0 ? "In Stock" : "Out of Stock"}
            color={product.count > 0 ? "success" : "error"}
          />
        </TableCell>

        <TableCell align="center">
          <IconButton
            color="primary"
            onClick={() =>
              navigate(`/admin/products/edit/${product._id}`)
            }
          >
            <EditIcon />
          </IconButton>

          <IconButton
            color="error"
            onClick={() => {
              setDeleteId(product._id);
              setOpenDelete(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </TableCell>

      </TableRow>
    ))
  )}
</TableBody>
        </Table>

      </Paper>

      <Dialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >
        <DialogTitle>
          Delete Product
        </DialogTitle>

        <DialogContent>
          Are you sure you want to delete this product?
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

export default Products;