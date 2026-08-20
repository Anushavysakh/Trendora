import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [category, setCategory] = useState("");
  const [subCategories, setSubCategories] = useState("");
  const [usertype, setUsertype] = useState([]);

  useEffect(() => {
    if (!isEdit) return;

    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/${id}`);

        setCategory(res.data.category);
        setUsertype(res.data.usertype);
        setSubCategories(res.data.subCategories.join(", "));
      } catch (err) {
        console.log(err);
        alert("Unable to load category");
      }
    };

    fetchCategory();
  }, [id, isEdit]);

  const handleUsertype = (type) => {
    if (usertype.includes(type)) {
      setUsertype(usertype.filter((u) => u !== type));
    } else {
      setUsertype([...usertype, type]);
    }
  };

  const handleSubmit = async () => {
    if (!category.trim()) {
      return alert("Please enter Category");
    }

    if (usertype.length === 0) {
      return alert("Select at least one User Type");
    }

    const data = {
      category,
      usertype,
      subCategories: subCategories
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      if (isEdit) {
        await api.put(`/categories/${id}`, data);

        alert("Category Updated Successfully");
      } else {
        await api.post("/categories", data);

        alert("Category Added Successfully");
      }

      navigate("/admin/categories");
    } catch (error) {
      alert(error.response?.data?.message || "Error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" mb={3}>
          {isEdit ? "Edit Category" : "Add Category"}
        </Typography>

        <TextField
          label="Category"
          fullWidth
          sx={{ mb: 3 }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <Typography mb={1}>User Type</Typography>

        <Box mb={3}>
          <FormControlLabel
            control={
              <Checkbox
                checked={usertype.includes("Women")}
                onChange={() => handleUsertype("Women")}
              />
            }
            label="Women"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={usertype.includes("Men")}
                onChange={() => handleUsertype("Men")}
              />
            }
            label="Men"
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={usertype.includes("Kids")}
                onChange={() => handleUsertype("Kids")}
              />
            }
            label="Kids"
          />
        </Box>

        <TextField
          label="Sub Categories"
          helperText="Separate using commas"
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 3 }}
          value={subCategories}
          onChange={(e) => setSubCategories(e.target.value)}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: "#C8A74E",
            "&:hover": {
              bgcolor: "#B8922D",
            },
          }}
        >
          {isEdit ? "Update Category" : "Save Category"}
        </Button>
      </Paper>
    </Container>
  );
}

export default CategoryForm;