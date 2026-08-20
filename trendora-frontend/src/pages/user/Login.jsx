import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Divider,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await api.post("/users/login", { email, password });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setError("");
      setGoogleLoading(true);

      const res = await api.post("/users/google-login", {
        credential: credentialResponse.credential,
      });

      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      setError(err.response?.data?.message || "Google login failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1A1A1D 0%, #2D2D34 100%)",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 5,
            bgcolor: "rgba(255, 255, 255, 0.98)",
            boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* BRANDING HEADER */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "#C8A74E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                mb: 1.5,
                boxShadow: "0 4px 12px rgba(200, 167, 78, 0.4)",
              }}
            >
              <LockOutlinedIcon fontSize="medium" />
            </Box>
            <Typography
              variant="h4"
              align="center"
              fontWeight="800"
              sx={{
                letterSpacing: "-0.5px",
                color: "#111",
                fontFamily: "Inter, sans-serif",
              }}
            >
              Trendora
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="text.secondary"
              mt={0.5}
            >
              Welcome back! Please enter your details.
            </Typography>
          </Box>

          {/* ERROR ALERT */}
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: 2,
                fontSize: "0.875rem",
              }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* GOOGLE LOGIN */}
          <Box
            display="flex"
            justifyContent="center"
            mb={3}
            sx={{
              "& > div": {
                width: "100% !important",
                display: "flex",
                justifyContent: "center",
              },
            }}
          >
            {googleLoading ? (
              <Button
                fullWidth
                disabled
                variant="outlined"
                sx={{
                  py: 1.2,
                  borderRadius: 2.5,
                  textTransform: "none",
                }}
              >
                <CircularProgress size={20} sx={{ mr: 1, color: "#C8A74E" }} />
                Signing in with Google...
              </Button>
            ) : (
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Google login failed")}
                useOneTap={false}
                shape="pill"
                theme="outline"
                width="100%"
              />
            )}
          </Box>

          {/* DIVIDER */}
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Divider sx={{ flex: 1, borderColor: "rgba(0,0,0,0.1)" }} />
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight="600"
              sx={{ letterSpacing: "1px" }}
            >
              OR
            </Typography>
            <Divider sx={{ flex: 1, borderColor: "rgba(0,0,0,0.1)" }} />
          </Box>

          {/* EMAIL FORM */}
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              variant="outlined"
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                },
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.6,
                borderRadius: 2.5,
                bgcolor: "#C8A74E",
                fontWeight: "bold",
                fontSize: "0.95rem",
                textTransform: "none",
                boxShadow: "0 6px 20px rgba(200, 167, 78, 0.35)",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  bgcolor: "#B6922A",
                  boxShadow: "0 8px 25px rgba(200, 167, 78, 0.45)",
                  transform: "translateY(-1px)",
                },
                "&:active": {
                  transform: "translateY(0)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          {/* FOOTER LINK */}
          <Typography
            mt={4}
            align="center"
            variant="body2"
            color="text.secondary"
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#C8A74E",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login;