import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
} from "@mui/material";

import api from "../../services/api";

function Banner() {
  const [banners, setBanners] = useState([]);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // LOAD BANNERS
  // =========================

  const fetchBanners = async () => {
    try {
      setFetching(true);
      setError("");

      const res = await api.get("/banners");

      setBanners(
        res.data.banners ||
        res.data.data ||
        res.data ||
        []
      );
    } catch (err) {
      console.error("Fetch banners error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load banners"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // =========================
  // SELECT IMAGE
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // =========================
  // UPLOAD TO CLOUDINARY
  // =========================

  const uploadImage = async () => {
    if (!imageFile) {
      throw new Error("Please select a banner image");
    }

    const formData = new FormData();

    formData.append("image", imageFile);

    const response = await api.post(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("UPLOAD RESPONSE:", response.data);

    return (
      response.data.url ||
      response.data.imageUrl ||
      response.data.secure_url
    );
  };

  // =========================
  // ADD BANNER
  // =========================

 const handleSubmit = async (e) => {
  e.preventDefault();

  setMessage("");
  setError("");

  if (!imageFile) {
    setError("Please select a banner image");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("image", imageFile);

    await api.post("/banners", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    setMessage("Banner added successfully");

    setTitle("");
    setSubtitle("");
    setImageFile(null);
    setPreview("");

    fetchBanners();

  } catch (err) {
    console.error("Add banner error:", err);

    setError(
      err.response?.data?.message ||
      "Failed to add banner"
    );
  } finally {
    setLoading(false);
  }
};

  // =========================
  // ACTIVATE / DEACTIVATE
  // =========================

  const handleToggle = async (banner) => {
    try {
      setMessage("");
      setError("");

      await api.put(`/banners/${banner._id}`, {
        isActive: !banner.isActive,
      });

      setMessage(
        banner.isActive
          ? "Banner deactivated"
          : "Banner activated"
      );

      fetchBanners();
    } catch (err) {
      console.error("Toggle banner error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to update banner"
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this banner?"
    );

    if (!confirmed) return;

    try {
      setMessage("");
      setError("");

      await api.delete(`/banners/${id}`);

      setMessage("Banner deleted successfully");

      fetchBanners();
    } catch (err) {
      console.error("Delete banner error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to delete banner"
      );
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={4}
      >
        Banner Management
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* ADD BANNER */}

      <Paper
        elevation={2}
        sx={{
          p: 4,
          mb: 5,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Add New Banner
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* IMAGE */}

            <Grid item xs={12} md={6}>
              <Typography
                fontWeight="600"
                mb={1}
              >
                Banner Image
              </Typography>

              <Button
                variant="outlined"
                component="label"
              >
                Choose Image

                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {preview && (
                <Box
                  sx={{
                    mt: 2,
                    width: "100%",
                    height: 220,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid #ddd",
                  }}
                >
                  <img
                    src={preview}
                    alt="Banner preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
            </Grid>

            {/* TEXT */}

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Banner Title"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Banner Subtitle"
                multiline
                rows={4}
                value={subtitle}
                onChange={(e) =>
                  setSubtitle(e.target.value)
                }
              />
            </Grid>

            {/* BUTTON */}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  background: "#C8A74E",
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                  "&:hover": {
                    background: "#B6922A",
                  },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={22}
                      sx={{
                        mr: 1,
                        color: "#fff",
                      }}
                    />
                    Uploading...
                  </>
                ) : (
                  "Add Banner"
                )}
              </Button>
            </Grid>

          </Grid>
        </Box>
      </Paper>

      {/* EXISTING BANNERS */}

      <Typography
        variant="h6"
        fontWeight="bold"
        mb={3}
      >
        Existing Banners
      </Typography>

      {fetching ? (
        <Box
          display="flex"
          justifyContent="center"
          py={5}
        >
          <CircularProgress />
        </Box>
      ) : banners.length === 0 ? (
        <Typography color="text.secondary">
          No banners added yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {banners.map((banner) => (
            <Grid
              item
              xs={12}
              md={6}
              lg={4}
              key={banner._id}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={banner.image}
                  alt={banner.title}
                />

                <CardContent>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    {banner.title}
                  </Typography>

                  <Typography
                    color="text.secondary"
                    mt={1}
                  >
                    {banner.subtitle}
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={Boolean(
                          banner.isActive
                        )}
                        onChange={() =>
                          handleToggle(banner)
                        }
                      />
                    }
                    label={
                      banner.isActive
                        ? "Active"
                        : "Inactive"
                    }
                  />
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    color="error"
                    variant="outlined"
                    onClick={() =>
                      handleDelete(banner._id)
                    }
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default Banner;