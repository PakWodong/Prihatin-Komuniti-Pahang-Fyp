import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField } from "@mui/material";
import Paper from '@mui/material/Paper';
import logo from '../image/th-removebg-preview.png';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme();

function ResetPassword() {
  
  const { email } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginError = (error) => {
    toast.error(
      <div className="custom-toast">
        <div className="custom-toast-icon" />
        {error}
      </div>,
      {
        className: 'custom-toast-container',
         closeButton: false,
      }
    );
  };

  const handleLoginSucess = (message) => {
    toast.success(
      <div className="custom-toast">
        <div className="custom-toast-icon" />
        {message}
      </div>,
      {
        className: 'custom-toast-container',
         closeButton: false,
      }
    );
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // Password validation
    if (!password) {
      handleLoginError("Password is required");
      return;
    }
    if (password.length < 8) {
      handleLoginError("Password must be at least 8 characters long");
      return;
    }
    if (!/\d/.test(password)) {
      handleLoginError("Password must contain at least one number");
      return;
    }
    if (!/[a-z]/.test(password)) {
      handleLoginError("Password must contain at least one lowercase letter");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      handleLoginError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      handleLoginError("Password must contain at least one special character");
      return;
    }
    if (!password || !confirmPassword) {
      handleLoginError('Please enter both password and confirm password');
      return;
    }
    if (password !== confirmPassword) {
      handleLoginError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/resetpassword/`, { email, password });
      if (response.data.success) {
        handleLoginSucess(response.data.message)
        setTimeout(() => {
          window.location.href = '/login'; // Redirect to login page
        }, 3000);
      } else {
        setIsLoading(false);
        handleLoginError(response.data.error)
      }
    } catch (error) {
      setIsLoading(false);
      handleLoginError('An error occured while reset your password. Please try again')
    }
  };


  return (
    <div className="form-container" style={{ height: '100vh' }}>
      {isLoading && (
        <div className="m-loading-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f0f0f0',
            height: '100%',
            width: '100%',
          }}
        >
          <Paper
            elevation={6}
            sx={{
              margin: 'auto',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              marginTop: '10%',
              textAlign: 'center',
            }}
          >
            <img src={logo} alt="Logo" style={{ height: '100px' }} />
            <Typography variant="h4" gutterBottom>
              New Password
            </Typography>
            <Box
              component="form"
              onSubmit={handleResetPassword}
              sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}
              noValidate
              autoComplete="off"
            >
              <TextField
                required
                fullWidth
                id="password"
                label="New Password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2, width: '80%' }}
              />
              <TextField
                required
                fullWidth
                id="confirm-password"
                label="Confirm Password"
                name="confirm-password"
                type="password"
                autoComplete="current-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 2, width: '80%' }}
              />
              <Button type="submit" disabled={isLoading} variant="contained" sx={{ width: '80%' }}className="authbutton">
              {isLoading ? 'Processing...' : 'Reset Password'} 
              </Button>
            </Box>
          </Paper>
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default ResetPassword;