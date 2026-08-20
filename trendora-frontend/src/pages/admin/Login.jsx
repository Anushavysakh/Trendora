import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect } from "react";



function Login() {
    
        const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {

  if (localStorage.getItem("token")) {
    navigate("/admin");
  }

}, [navigate]);

const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success",
});

const handleLogin = async () => {

  if (!email.trim() || !password.trim()) {
    return setSnackbar({
      open: true,
      message: "Please enter email and password",
      severity: "warning",
    });
  }

  try {

    const res = await api.post("/users/login", {
      email,
      password,
    });

    // Check if user is admin
    if (res.data.user.role !== "admin") {

      return setSnackbar({
        open: true,
        message: "Access Denied",
        severity: "error",
      });

    }

    localStorage.setItem("token", res.data.token);
    localStorage.setItem(
      "admin",
      JSON.stringify(res.data.user)
    );

    setSnackbar({
      open: true,
      message: "Login Successful",
      severity: "success",
    });

    setTimeout(() => {
      navigate("/admin");
    }, 800);

  } catch (error) {

    setSnackbar({
      open: true,
      message:
        error.response?.data?.message || "Login Failed",
      severity: "error",
    });

  }

};
  return (

    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <Paper
        elevation={5}
        sx={{
          width: 420,
          p: 5,
          borderRadius: 4,
        }}
      >

        <Typography
          variant="h4"
          fontWeight="bold"
          align="center"
          mb={1}
        >
          Trendora
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          mb={4}
        >
          Admin Login
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">

                <IconButton
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword
                    ? <VisibilityOff />
                    : <Visibility />}
                </IconButton>

              </InputAdornment>
            ),
          }}
        />

<Button
  onClick={handleLogin}
            fullWidth
          variant="contained"
          sx={{
            mt: 3,
            bgcolor: "#C8A74E",
            "&:hover": {
              bgcolor: "#B8922D",
            },
          }}
        >
          Login
        </Button>

      </Paper>
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
    </Box>

  );

}

export default Login;