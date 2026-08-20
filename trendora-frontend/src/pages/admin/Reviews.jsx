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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
  Rating,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

function Reviews() {

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedReview, setSelectedReview] = useState(null);

  const [openView, setOpenView] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchReviews = async () => {

    try {

      const res = await api.get("/reviews");

      setReviews(res.data);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = reviews.filter(
    (review) =>
      review.userName.toLowerCase().includes(search.toLowerCase()) ||
      review.comment.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {

    try {

      await api.delete(`/reviews/${deleteId}`);

      setReviews((prev) =>
        prev.filter((r) => r._id !== deleteId)
      );

      setOpenDelete(false);

      setSnackbar({
        open: true,
        message: "Review Deleted Successfully",
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
      Reviews
    </Typography>
  </Box>

  <TextField
    label="Search Reviews"
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
            <b>Customer</b>
          </TableCell>

          <TableCell>
            <b>Product ID</b>
          </TableCell>

          <TableCell>
            <b>Rating</b>
          </TableCell>

          <TableCell>
            <b>Comment</b>
          </TableCell>

          <TableCell>
            <b>Date</b>
          </TableCell>

          <TableCell align="center">
            <b>Actions</b>
          </TableCell>

        </TableRow>

      </TableHead>

      <TableBody>

        {filteredReviews.map((review) => (

          <TableRow
            key={review._id}
            hover
          >

            <TableCell>

              {review.userName}

            </TableCell>

            <TableCell>

              {review.productId}

            </TableCell>

            <TableCell>

              <Rating
                value={review.rating}
                readOnly
                size="small"
              />

            </TableCell>

            <TableCell>

              {review.comment.length > 40
                ? review.comment.substring(0, 40) + "..."
                : review.comment}

            </TableCell>

            <TableCell>

              {new Date(
                review.createdAt
              ).toLocaleDateString()}

            </TableCell>

            <TableCell align="center">

              <IconButton
                color="primary"
                onClick={() => {
                  setSelectedReview(review);
                  setOpenView(true);
                }}
              >
                <VisibilityIcon />
              </IconButton>

              <IconButton
                color="error"
                onClick={() => {
                  setDeleteId(review._id);
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
        {/* View Review Dialog */}

      <Dialog
        open={openView}
        onClose={() => setOpenView(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Review Details
        </DialogTitle>

        <DialogContent>

          {selectedReview && (

            <Box mt={1}>

              <Typography mb={2}>
                <b>Customer :</b> {selectedReview.userName}
              </Typography>

              <Typography mb={2}>
                <b>Product ID :</b> {selectedReview.productId}
              </Typography>

              <Typography mb={2}>
                <b>Rating :</b>
              </Typography>

              <Rating
                value={selectedReview.rating}
                readOnly
              />

              <Typography mt={3}>
                <b>Comment :</b>
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  mt: 1,
                  bgcolor: "#fafafa",
                }}
              >
                {selectedReview.comment}
              </Paper>

              <Typography mt={3}>
                <b>Reviewed On :</b>{" "}
                {new Date(
                  selectedReview.createdAt
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
          Delete Review
        </DialogTitle>

        <DialogContent>
          Are you sure you want to delete this review?
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

export default Reviews;