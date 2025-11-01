import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      alert("Login successful!");
      navigate("/"); // redirect to blogs list
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f6f8",
      }}
    >
      <Paper sx={{ p: 4, width: 400, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              type="Username"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <Typography color="error" variant="body2" textAlign="center">
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
