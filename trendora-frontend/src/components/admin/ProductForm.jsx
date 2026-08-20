import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate, useParams } from "react-router-dom";

import {
    Container,
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Button,
    Box,
    Stack,
} from "@mui/material";

// ---- design tokens -------------------------------------------------------
const gold = "#C8A74E";
const goldHover = "#B8922D";
const goldSoft = "#FBF6E9";
const ink = "#22201C";
const inkSoft = "#78706A";
const line = "#E8E3DA";
const paperBg = "#FFFFFF";
const pageBg = "#FAFAF8";

const STEPS = [
    { key: "basics", label: "Basics" },
    { key: "pricing", label: "Pricing & Stock" },
    { key: "audience", label: "Category & Audience" },
    { key: "images", label: "Images" },
];

function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [step, setStep] = useState(0);
    const [stepError, setStepError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        mrp: "",
        price: "",
        count: "",
        category: "",
        subCategory: "",
        usertype: [],
        image: "",
        images: [],
        weight: "",
    });

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/categories");
                setCategories(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!formData.category) {
            setSubCategories([]);
            return;
        }

        const selected = categories.find(
            (cat) =>
                cat.category.trim().toLowerCase() ===
                formData.category.trim().toLowerCase()
        );

        // Defensive: subCategories from the API may arrive as plain strings
        // or as objects (e.g. { name: "Shirts" }). Normalize to strings so
        // MenuItem never receives an object as a child/value — that silently
        // breaks the Select ("won't open").
        const normalized = (selected?.subCategories || []).map((sub) =>
            typeof sub === "string" ? sub : sub?.name ?? String(sub)
        );

        setSubCategories(normalized);
    }, [formData.category, categories]);

    useEffect(() => {
        if (!isEdit) return;

        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setFormData(res.data);
            } catch (error) {
                console.log(error);
                alert("Unable to load product");
            }
        };
        fetchProduct();
    }, [id, isEdit]);

    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file) => {
        const data = new FormData();
        data.append("image", file);

        try {
            setUploading(true);
            const token = localStorage.getItem("token");

            const res = await api.post("/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            setFormData((prev) => ({ ...prev, image: res.data.imageUrl }));
            setUploading(false);
            alert("Image Uploaded Successfully");
        } catch (err) {
            console.log(err);
            setUploading(false);
            alert("Image Upload Failed");
        }
    };

    const uploadAdditionalImages = async (files) => {
        try {
            setUploading(true);
            const uploadedImages = [];

            for (const file of files) {
                const data = new FormData();
                data.append("image", file);

                const res = await api.post("/upload", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                uploadedImages.push(res.data.imageUrl);
            }

            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...uploadedImages],
            }));

            setUploading(false);
            alert("Additional Images Uploaded Successfully");
        } catch (err) {
            console.log(err);
            setUploading(false);
            alert("Failed to Upload Additional Images");
        }
    };

    const removeMainImage = () => {
        setFormData((prev) => ({ ...prev, image: "" }));
    };

    const removeAdditionalImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "category") {
            setFormData({ ...formData, category: value, subCategory: "" });
            return;
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleUserType = (e) => {
        const { value, checked } = e.target;

        if (checked) {
            setFormData({ ...formData, usertype: [...formData.usertype, value] });
        } else {
            setFormData({
                ...formData,
                usertype: formData.usertype.filter((u) => u !== value),
            });
        }
    };

    // ---- per-step validation, run before "Next" and again on submit -----
    const validateStep = (index) => {
        if (index === 0) {
            if (!formData.name.trim()) return "Product name is required";
            if (!formData.description.trim()) return "Description is required";
        }

        if (index === 1) {
            if (!formData.mrp || Number(formData.mrp) <= 0)
                return "Please enter a valid MRP";
            if (!formData.price || Number(formData.price) <= 0)
                return "Please enter a valid selling price";
            if (Number(formData.price) > Number(formData.mrp))
                return "Selling price cannot be greater than MRP";
            if (!formData.count || Number(formData.count) < 0)
                return "Please enter stock quantity";
            if (!formData.weight || Number(formData.weight) <= 0)
                return "Please enter a valid product weight";
        }

        if (index === 2) {
            if (!formData.category) return "Please select a category";
            if (!formData.subCategory) return "Please select a sub category";
            if (formData.usertype.length === 0)
                return "Please select at least one user type";
        }

        if (index === 3) {
            if (!formData.image) return "Please upload a main image";
        }

        return "";
    };

    const goNext = () => {
        const err = validateStep(step);
        if (err) {
            setStepError(err);
            return;
        }
        setStepError("");
        setStep((s) => Math.min(s + 1, STEPS.length - 1));
    };

    const goBack = () => {
        setStepError("");
        setStep((s) => Math.max(s - 1, 0));
    };

    const handleSubmit = async () => {
        for (let i = 0; i < STEPS.length; i++) {
            const err = validateStep(i);
            if (err) {
                setStep(i);
                setStepError(err);
                return;
            }
        }

        try {
            let response;

            if (isEdit) {
                response = await api.put(`/products/${id}`, formData);
                alert("✅ Product Updated Successfully");
            } else {
                response = await api.post("/products", formData);
                alert("✅ Product Added Successfully");
            }

            console.log(response.data);

            setFormData({
                name: "",
                description: "",
                mrp: "",
                price: "",
                count: "",
                weight: "",
                category: "",
                subCategory: "",
                usertype: [],
                image: "",
                images: [],
            });
            setStep(0);
        } catch (error) {
            console.log("ERROR:", error);

            if (error.response) {
                console.log("Response:", error.response.data);
                alert(error.response.data.message || "Failed to Add Product");
            } else {
                alert(error.message);
            }
        }
    };

    const textFieldStyle = {
        "& .MuiOutlinedInput-root": {
            backgroundColor: paperBg,
            borderRadius: "10px",
            "& fieldset": { borderColor: line },
            "&:hover fieldset": { borderColor: gold },
            "&.Mui-focused fieldset": { borderColor: gold, borderWidth: "1.5px" },
        },
        "& .MuiInputLabel-root.Mui-focused": { color: gold },
    };

    // ---- step rail (signature element) -----------------------------------
    const StepRail = () => (
        <Stack direction="row" alignItems="center" sx={{ mb: 6 }}>
            {STEPS.map((s, i) => {
                const isActive = i === step;
                const isDone = i < step;
                return (
                    <Box
                        key={s.key}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flex: i < STEPS.length - 1 ? 1 : "0 0 auto",
                        }}
                    >
                        <Stack alignItems="center" spacing={1} sx={{ minWidth: 64 }}>
                            <Box
                                sx={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 13,
                                    fontWeight: 600,
                                    transition: "all 0.2s ease",
                                    bgcolor: isActive || isDone ? gold : "transparent",
                                    color: isActive || isDone ? "#fff" : inkSoft,
                                    border: `1.5px solid ${isActive || isDone ? gold : line}`,
                                }}
                            >
                                {isDone ? "✓" : i + 1}
                            </Box>
                            <Typography
                                sx={{
                                    fontSize: 12,
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? ink : inkSoft,
                                    whiteSpace: "nowrap",
                                    letterSpacing: "0.02em",
                                }}
                            >
                                {s.label}
                            </Typography>
                        </Stack>

                        {i < STEPS.length - 1 && (
                            <Box
                                sx={{
                                    flex: 1,
                                    height: "1.5px",
                                    mx: 1.5,
                                    mb: 2.5,
                                    bgcolor: i < step ? gold : line,
                                    transition: "background-color 0.2s ease",
                                }}
                            />
                        )}
                    </Box>
                );
            })}
        </Stack>
    );

    return (
        <Box sx={{ bgcolor: pageBg, minHeight: "100vh", py: { xs: 4, md: 8 } }}>
            <Container maxWidth="sm">
                <Typography
                    sx={{
                        fontSize: 12,
                        fontWeight: 600,
                        letterSpacing: "0.12em",
                        color: gold,
                        mb: 1,
                        textAlign: "center",
                    }}
                >
                    STEP {step + 1} OF {STEPS.length}
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        mb: 5,
                        color: ink,
                        fontWeight: 600,
                        letterSpacing: "-0.01em",
                        textAlign: "center",
                    }}
                >
                    {isEdit ? "Edit Product" : "Add Product"}
                </Typography>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 3,
                        border: `1px solid ${line}`,
                        bgcolor: paperBg,
                    }}
                >
                    <StepRail />

                    {/* ---- Step 0: Basics ---- */}
                    {step === 0 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Product Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    sx={textFieldStyle}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={5}
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    sx={textFieldStyle}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* ---- Step 1: Pricing & Stock ---- */}
                    {step === 1 && (
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="MRP"
                                    type="number"
                                    name="mrp"
                                    value={formData.mrp}
                                    onChange={handleChange}
                                    sx={textFieldStyle}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Selling Price"
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    sx={textFieldStyle}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Stock"
                                    type="number"
                                    name="count"
                                    value={formData.count}
                                    onChange={handleChange}
                                    sx={textFieldStyle}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Weight (grams)"
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    inputProps={{ min: 1 }}
                                    helperText="Example: 50 grams"
                                    sx={textFieldStyle}
                                />
                            </Grid>
                        </Grid>
                    )}

                    {/* ---- Step 2: Category & Audience ---- */}
                    {step === 2 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    sx={textFieldStyle}
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat._id} value={cat.category.trim()}>
                                            {cat.category.trim()}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Sub Category"
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleChange}
                                    disabled={!formData.category}
                                    helperText={
                                        formData.category && subCategories.length === 0
                                            ? "No sub categories found for this category"
                                            : " "
                                    }
                                    sx={textFieldStyle}
                                >
                                    {subCategories.map((sub) => (
                                        <MenuItem key={sub} value={sub}>
                                            {sub}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography sx={{ fontWeight: 600, color: ink, mb: 1 }}>
                                    User Type
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    {["Women", "Men", "Kids"].map((type) => {
                                        const active = formData.usertype.includes(type);
                                        return (
                                            <Box
                                                key={type}
                                                onClick={() =>
                                                    handleUserType({
                                                        target: { value: type, checked: !active },
                                                    })
                                                }
                                                sx={{
                                                    px: 2.5,
                                                    py: 1,
                                                    borderRadius: "999px",
                                                    border: `1.5px solid ${active ? gold : line}`,
                                                    bgcolor: active ? goldSoft : "transparent",
                                                    color: active ? goldHover : inkSoft,
                                                    fontSize: 14,
                                                    fontWeight: 500,
                                                    cursor: "pointer",
                                                    userSelect: "none",
                                                    transition: "all 0.15s ease",
                                                }}
                                            >
                                                {type}
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            </Grid>
                        </Grid>
                    )}

                    {/* ---- Step 3: Images ---- */}
                    {step === 3 && (
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography sx={{ fontWeight: 600, color: ink, mb: 1.5 }}>
                                    Main Image
                                </Typography>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{
                                        color: gold,
                                        borderColor: gold,
                                        "&:hover": { borderColor: goldHover, bgcolor: goldSoft },
                                    }}
                                >
                                    {uploading ? "Uploading..." : "Upload Main Image"}
                                    <input
                                        hidden
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files[0]) uploadImage(e.target.files[0]);
                                        }}
                                    />
                                </Button>

                                {formData.image && (
                                    <Box mt={2} position="relative" width={180}>
                                        <img
                                            src={formData.image}
                                            alt="Preview"
                                            width={180}
                                            style={{ borderRadius: 10, border: `1px solid ${line}` }}
                                        />
                                        <Button
                                            size="small"
                                            onClick={removeMainImage}
                                            sx={{
                                                position: "absolute",
                                                top: 5,
                                                right: 5,
                                                minWidth: 28,
                                                width: 28,
                                                height: 28,
                                                borderRadius: "50%",
                                                p: 0,
                                                bgcolor: "#fff",
                                                color: ink,
                                                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                                "&:hover": { bgcolor: "#f5f5f5" },
                                            }}
                                        >
                                            ✕
                                        </Button>
                                    </Box>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <Typography sx={{ fontWeight: 600, color: ink, mb: 0.5 }}>
                                    Additional Images
                                </Typography>
                                <Typography variant="body2" sx={{ color: inkSoft, mb: 1.5 }}>
                                    Optional
                                </Typography>

                                <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{
                                        color: gold,
                                        borderColor: gold,
                                        "&:hover": { borderColor: goldHover, bgcolor: goldSoft },
                                    }}
                                >
                                    {uploading ? "Uploading..." : "Add More Images"}
                                    <input
                                        hidden
                                        multiple
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files.length > 0)
                                                uploadAdditionalImages(Array.from(e.target.files));
                                        }}
                                    />
                                </Button>

                                {formData.images.length > 0 && (
                                    <Box mt={3} display="flex" gap={2} flexWrap="wrap">
                                        {formData.images.map((img, index) => (
                                            <Box key={index} sx={{ position: "relative" }}>
                                                <img
                                                    src={img}
                                                    alt={`Preview ${index}`}
                                                    width={110}
                                                    height={110}
                                                    style={{
                                                        borderRadius: 10,
                                                        objectFit: "cover",
                                                        border: `1px solid ${line}`,
                                                    }}
                                                />
                                                <Button
                                                    size="small"
                                                    onClick={() => removeAdditionalImage(index)}
                                                    sx={{
                                                        position: "absolute",
                                                        top: 5,
                                                        right: 5,
                                                        minWidth: 26,
                                                        width: 26,
                                                        height: 26,
                                                        borderRadius: "50%",
                                                        p: 0,
                                                        bgcolor: "#fff",
                                                        color: ink,
                                                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                                        "&:hover": { bgcolor: "#f5f5f5" },
                                                    }}
                                                >
                                                    ✕
                                                </Button>
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    )}

                    {stepError && (
                        <Typography
                            sx={{
                                mt: 3,
                                fontSize: 13,
                                color: "#B3261E",
                                bgcolor: "#FDEDEC",
                                border: "1px solid #F5C6C0",
                                borderRadius: "8px",
                                px: 2,
                                py: 1,
                            }}
                        >
                            {stepError}
                        </Typography>
                    )}

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mt: 5 }}
                    >
                        <Button
                            onClick={goBack}
                            disabled={step === 0}
                            sx={{ color: inkSoft, fontWeight: 500, textTransform: "none" }}
                        >
                            Back
                        </Button>

                        {step < STEPS.length - 1 ? (
                            <Button
                                onClick={goNext}
                                variant="contained"
                                sx={{
                                    bgcolor: gold,
                                    px: 4,
                                    py: 1.2,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    boxShadow: "none",
                                    "&:hover": { bgcolor: goldHover, boxShadow: "none" },
                                }}
                            >
                                Continue
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                variant="contained"
                                sx={{
                                    bgcolor: gold,
                                    px: 4,
                                    py: 1.2,
                                    fontWeight: 600,
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    boxShadow: "none",
                                    "&:hover": { bgcolor: goldHover, boxShadow: "none" },
                                }}
                            >
                                {isEdit ? "Update Product" : "Save Product"}
                            </Button>
                        )}
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
}

export default ProductForm;